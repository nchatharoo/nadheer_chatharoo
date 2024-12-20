---
title: "MVVM"
image: "/images/cover_mvvm.jpg"
---

## Un modèle de conception d'interface utilisateur

MVVM est un modèle architectural d'interface utilisateur, et signifie Model-View-ViewModel. MVVM est une variante du MVC créée par Microsoft, qui vise à minimiser le code standard nécessaire pour synchroniser les événements de la Vue et les mises à jour du Modèle que gèrent les Contrôleurs.

Grâce à un composant ViewModel, la solution MVVM de Microsoft connecte de manière transparente les événements de la Vue avec les mises à jour du Modèle.

Les développeurs déclarent les liaisons du ViewModel avec les déclarations de la Vue en XAML, et le framework gère automatiquement les liaisons à l'exécution, selon le système graphique .NET de Microsoft.

Comme la plupart des plateformes n'offrent pas le câblage automatique que propose le système graphique .NET, MVVM est souvent connu sous le nom de Model-View-Binder en dehors des systèmes Microsoft.

Dans UIKit, par exemple, il n'y a pas de mécanisme pour connecter automatiquement un ViewModel à une Vue, donc le développeur doit implémenter les composants Binder. Il est courant d'utiliser des frameworks comme RxSwift ou Combine (ou des closures !) pour faciliter les connexions entre la Vue et le ViewModel.

## Comparaison entre MVC et MVVM :

![MVC-MVVM](/images/2021-12-29-MVC-MVVM.png)

La seule différence entre les structures MVC et MVVM est qu'un ViewModel ne contient pas de référence à la Vue comme le fait le Contrôleur dans MVC.

Pour rendre à la fois la Vue et le ViewModel plus réutilisables, ils ne devraient pas dépendre directement l'un de l'autre. Ils devraient pouvoir communiquer de manière indirecte grâce à un mécanisme de liaison. 

Les UIViewController sont des candidats idéaux pour agir comme Binders dans UIKit, reliant la Vue au ViewModel. C'est parce que pour afficher des vues à l'écran dans UIKit, votre application doit avoir au moins un UIViewController.

Comme les UIViewController ont déjà une référence à leurs Vues correspondantes, ils sont un excellent endroit pour injecter et lier le ViewModel avec la Vue.

![MVVM-Binder](/images/2021-12-29-MVVM-Binder.png)

Cependant, dans UIKit, MVVM ne réduira pas beaucoup le code standard car il n'y a pas de liaison automatique. Néanmoins, les ViewModels sont une bonne idée pour créer une logique réutilisable entre les composants UI et core et une meilleure séparation architecturale. Il est recommandé que les ViewModels soient indépendants de la plateforme et du framework afin que nous puissions les réutiliser sur plusieurs plateformes.

## MVVM en pratique :

Imaginez un simple ViewController :

```swift
final class ViewController: NSObject {

  private(set) lazy var view: UIRefreshControl = {
      let view = UIRefreshControl()
        view.addTarget(self, action: #selector(refresh), for: .valueChanged)
        return view
  }()

  private let loader: ModelLoader

  var onRefresh: (([Model]) -> Void)?

  init(loader: ModelLoader) {
        self.loader = loader
  }

  @objc func refresh() {
        view.beginRefreshing()
        loader.load { [weak self] result in
                if let model = try? result.get() {
                self?.onRefresh?(model)
            }
            self?.view.endRefreshing()
        }
    }
}
```

Nous pouvons voir que le ViewController communique avec le ModelLoader, gère également l'état de chargement du modèle avec la variable `onRefresh` et crée et configure un UIRefreshControl.

L'objectif est de déplacer certaines responsabilités du ViewController vers un ViewModel.

Il existe deux façons courantes de créer un ViewModel, avec état (stateful) et sans état (stateless).

## Version avec état :

Ainsi, le ViewModel peut avoir plusieurs types d'états (chargement, en attente, etc...) et nous notifions l'observateur de tout changement d'état avec une simple closure (`onChange`).
Nous définissons également les transitions d'état en définissant la `var state` dans la méthode `loadModel()`. Comme l'état est privé, nous exposons des accesseurs pour l'état actuel du ViewModel avec `isLoading` (un switch est suffisant dans ce cas) et une var calculée pour accéder au modèle, s'il est chargé, nous retournons le modèle sinon nous retournons nil.

```swift
final class ViewModel {
    private let loader: ModelLoader
    
    init(loader: ModelLoader) {
        self.loader = loader
    }
    
    private enum State {
        case loading
        case pending
        case loaded([Model])
        case failure
    }
    
    private var state = State.pending {
        didSet { onChange?(self) }
    }
    
    var onChange: ((ViewModel) -> Void)?
    
    var isLoading: Bool {
        switch state {
            case .loading: return true
            case .pending, .loaded, .failure: return false
        }
    }
    
    var model: [Model]? {
        switch state {
        case .loaded(let model):
            return model
        case .loading, .pending, .failure:
            return nil
        }
    }
    
    func loadModel() {
        state = .loading
        loader.load { [weak self] result in
            if let model = try? result.get() {
                self?.state = .loaded(model)
            } else {
                self?.state = .failed
            }
        }
    }
}
```

C'est tout ce dont nous avons besoin dans le ViewModel, mais qu'en est-il du ViewController ? 

Premièrement, nous remplaçons la référence `ModelLoader` par une propriété `viewModel`. 

Deuxièmement, dans la fonction `refresh`, nous définissons le callback `onChange` pour obtenir un `viewModel` et sa propriété `isLoading` pour déterminer si nous devons rafraîchir ou non. 

Troisièmement, nous devons voir si nous avons un modèle dans le ViewModel, et le passer avec la closure `onRefresh`. 

Et enfin, nous disons au ViewModel de charger le modèle

```swift
final class ViewController: NSObject {
    private(set) lazy var view: UIRefreshControl = {
        let view = UIRefreshControl()
        view.addTarget(self, action: #selector(refresh), for: .valueChanged)
        return view
    }()

    private let viewModel: ViewModel
    
    var onRefresh: (([Model]) -> Void)?
    
    init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }
    
    @objc func refresh() {
        viewModel.onChange = { [weak self] viewModel in
            if viewModel.isLoading {
                self?.view.beginRefreshing()
            } else {
                self?.view.endRefreshing()
            }
            
            if let model = viewModel.model {
                self?.onRefresh?(model)
            }
        }
        viewModel.loadModel()
    }
}
```

Ainsi, la closure `onChange` est la logique de liaison entre notre ViewModel et la Vue, se produisant dans le ViewController. Nous pouvons même envelopper la closure dans une fonction `binded`, de sorte que la Vue soit un UIRefreshControl lié :

```swift
private(set) lazy var view = binded(UIRefreshControl()) 

private func binded(_ view: UIRefreshControl) -> UIRefreshControl {
      viewModel.onChange = { [weak self] viewModel in
          if viewModel.isLoading {
              self?.view.beginRefreshing()
          } else {
              self?.view.endRefreshing()
          }

          if let model = viewModel.model {
              self?.onRefresh?(model)
          }
      }
      view.addTarget(self, action: #selector(refresh), for: .valueChanged)
      return view
}
```

Remarquez les dernières lignes de code, nous ne définissons pas le `viewModel` comme une action cible avec la vue. C'est parce que le modèle d'action cible force l'instance à être un NSObject, et se conformer à NSObject est une exigence d'UIKit. Les view models devraient être agnostiques de la plateforme, en faisant du ViewModel une sous-classe de NSObject, nous divulguons des détails d'implémentation juste pour satisfaire UIKit. 
En gardant `self`, c'est le ViewController qui transmet le message au ViewModel.

Il y a un autre code suspect, le `onRefresh` fait référence au Model ! Nous pouvons déplacer cette logique vers le ViewModel, car le ViewController ne fait que passer le `model`, il ne fait rien avec.

```swift
final class ViewController: NSObject {
    private(set) lazy var view = binded(UIRefreshControl()) 
    
    private let viewModel: ViewModel
        
    init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }
    
    @objc func refresh() {
        viewModel.loadModel()
    }
    
    private func binded(_ view: UIRefreshControl) -> UIRefreshControl {
        viewModel.onChange = { [weak self] viewModel in
            if viewModel.isLoading {
                self?.view.beginRefreshing()
            } else {
                self?.view.endRefreshing()
            }
        }
        view.addTarget(self, action: #selector(refresh), for: .valueChanged)
    }
}
```

Maintenant, notre ViewController ne gère aucun état, il lie la Vue au ViewModel. Toute la gestion de l'état vit maintenant dans une version avec état du ViewModel. 

Nous n'avons pas besoin de conserver l'état du modèle, en le transmettant simplement à la closure `onRefresh`, nous pouvons nous débarrasser de 
`self?.state = .loaded(model)` 
Nous devons toujours mettre à jour la Vue, donc le nouvel état est `.pending`. Nous nous retrouvons donc avec deux états, soit chargement soit en attente.
Et parce que nous n'avons que deux états, un simple booléen `isLoading` est suffisant, nous pouvons supprimer l'enum `State` et la var calculée `model`.

```swift
final class ViewModel {
    private let loader: ModelLoader
    
    init(loader: ModelLoader) {
        self.loader = loader
    }
    
    var onChange: ((ViewModel) -> Void)?
    var onRefresh: (([Model]) -> Void)?

    private(set) var isLoading: Bool = false {
        didSet { onChange?(self) }
    }
    
    func loadModel() {
        isLoading = true
        loader.load { [weak self] result in
            if let model = try? result.get() {
                self?.onRefresh?(model)
            }
        isLoading = false
        }
    }
}
```

Transformons le ViewModel en une version sans état.

## Version sans état :

Nous pouvons voir que le ViewModel conserve l'état avec le booléen `isLoading`, pour obtenir un état transitoire, nous pouvons utiliser une closure observateur pour chaque état.

```swift
final class ViewModel {
    private let loader: ModelLoader
    
    init(loader: ModelLoader) {
        self.loader = loader
    }
  
    var onRefresh: (([Model]) -> Void)?
    var onLoadingStateChange: ((Bool) -> Void)?
        
    func loadModel() {
        onLoadingStateChange?(true)
        loader.load { [weak self] result in
            if let model = try? result.get() {
                self?.onRefresh?(model)
            }
            onLoadingStateChange?(false)
        }
    }
}
```

En ayant un `onLoadingStateChange`, nous pouvons passer la transition d'état dans la closure. Et dans le ViewController, nous avons maintenant ceci :

```swift
final class ViewController: NSObject {
    private(set) lazy var view = binded(UIRefreshControl()) 
    
    private let viewModel: ViewModel
        
    init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }
    
    @objc func refresh() {
        viewModel.loadModel()
    }
    
    private func binded(_ view: UIRefreshControl) -> UIRefreshControl {
        viewModel.onLoadingStateChange = { [weak view] isLoading in
            if isLoading {
                view?.beginRefreshing()
            } else {
                view?.endRefreshing()
            }
        }
        view.addTarget(self, action: #selector(refresh), for: .valueChanged)
    }
}
```

Dans la fonction `binded`, nous définissons le `onLoadingStateChange` en passant un booléen, et en affaiblissant la vue, puisque nous n'avons pas besoin d'une référence à self.

## Bonus : Génériques et typealias

Dans le ViewModel, nous pouvons utiliser des Génériques et des typealias, de cette façon nous ne laissons pas de place aux suppositions.

```swift
final class ViewModel {
    typealias Observer<T> = (T) -> Void
    
    private let loader: ModelLoader
    
    init(loader: ModelLoader) {
        self.loader = loader
    }
    
    var onRefresh: Observer<Model>?
    var onLoadingStateChange: Observer<Bool>?
        
    func loadModel() {
        onLoadingStateChange?(true)
        loader.load { [weak self] result in
            if let model = try? result.get() {
                self?.onRefresh?(model)
            }
            onLoadingStateChange?(false)
        }
    }
}
```