---
title: "Threading dans SwiftUI avec le Pattern Décorateur"
image: "/images/cover_decorator.jpg"
---

# Découplage des détails de threading dans SwiftUI avec le Pattern Décorateur

Dans cet article, nous allons voir comment le Pattern Décorateur peut aider les vues SwiftUI à devenir plus propres et plus centrées sur leur objectif principal en supprimant les détails de threading. Voyons comment cela fonctionne. Le Pattern Décorateur est un modèle de conception structurel qui vous permet d'ajouter une nouvelle fonctionnalité à un objet sans changer sa structure fondamentale. Il implique un ensemble de classes décorateur qui enveloppent des composants concrets. Les classes décorateur reflètent le type des composants qu'elles décorent (elles ont la même interface) mais ajoutent ou remplacent un comportement.

Créons un exemple simple :

![](/images/ouHhzvPJlaDX5erTqOA8J3EQxk.png)

Créez la vue et utilisez la fonction fetchData :

![](/images/y3sAQ2ItHQQ4XLYD7ME5Dd5uCt8.png)

Remarquez le DispatchQueue utilisé ici, il est nécessaire car DispatchQueue.main.async est utilisé pour s'assurer que la closure mettant à jour la propriété d'état data est exécutée sur le thread principal.

Lorsque fetchData se termine, elle appelle la closure fournie avec les nouvelles données. La closure met ensuite à jour la propriété data, ce qui déclenche un nouveau rendu de la vue Text. Comme les vues SwiftUI sont mises à jour et dessinées sur le thread principal, tout changement de l'interface utilisateur (comme la mise à jour de la propriété data) doit être effectué depuis le thread principal pour éviter les conditions de course potentielles ou les incohérences de l'interface utilisateur. Mais maintenant, la ContentView récupère les données onAppear et met à jour son état, mais les détails de threading sont mélangés avec le code de la vue. C'est là que le Pattern Décorateur vient à la rescousse.

Définissons d'abord un protocole décorateur :

![](/images/rLMV0bpZjwAJNOgMdbuBleDEcM.png)

Et créons un décorateur :
![](/images/TbfRz8NH2b7antsiwZSihRCHiE.png)

Ce décorateur accepte une closure de contenu et une closure onAppear. Il s'assure que la closure est exécutée sur le thread principal. Nous pouvons maintenant appliquer notre MainThreadDecorator à la vue Text :

![](/images/sqZDUt3ObWv7Jksg6f8ME9Oaug.png)