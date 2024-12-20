---
title: "SwiftUI et la gestion d'état"
image: "/images/cover_stateobject.jpg"
---

# @StateObject, @ObservedObject et @EnvironmentObject

Alors que faire si nous voulons lier notre vue à un objet de classe ? Nous pouvons utiliser @StateObject, @ObservedObject, ou @EnvironmentObject pour gérer l'état, mais nous devons faire en sorte que notre classe se conforme au protocole ObservableObject. Comme le dit la documentation : Un type d'objet avec un éditeur qui émet avant que l'objet n'ait changé.

Cela signifie simplement que notre classe agit comme un éditeur et notifie ses abonnés des changements pour les propriétés marquées avec @Published.

La classe se conforme à ObservableObject, marquons une propriété comme @Published et connectons-la à une vue.

## @StateObject

Lors de l'utilisation de @StateObject, SwiftUI créera l'objet une seule fois. Même si la vue entière doit être re-rendue.

![](/images/tIV0Mm9XZexOIa9HMbiSbPAdVOg.png)

Dans le code ci-dessus, lorsque l'utilisateur appuie sur le bouton, tous les éléments changent de couleur. L'objet Counter est créé une fois, et garde sa valeur peu importe le nombre de fois où la couleur est changée (re-rendue). Lorsque notre vue est propriétaire de l'objet (c'est-à-dire qu'elle le crée), nous devons utiliser @StateObject.

![](/images/AJ6v5gz9oTI1msRKB4y8MgWjD6E.mp4)

## @ObservedObject

Au contraire, lors de l'instanciation d'un @ObservedObject, l'objet sera re-rendu chaque fois que la vue est re-rendue.

![](/images/gmyoY1u6g35iD6yvTjfzH29sOs.png)

Nous pouvons voir que le Counter est réinitialisé à 0 à chaque tapotement, car ContentView ne possède pas StateStepper ou Counter, elle ne connaît pas leur état, donc ils sont re-rendus.

![](images/YbpAvlH9PUXcAdGsu8g2ftCgPaE.mp4)

## @EnvironmentObject

Parfois, nous aurons des données qui n'ont pas besoin d'être partagées avec toutes les vues de notre application, pensez au nom d'utilisateur ou à l'avatar. Donc pour éviter le couplage étroit entre les vues, Apple fournit le wrapper @EnvironmentObject.

![](/images/94JcDYluiJkHwt1gkBLZcafRjv0.png)

Dans le code ci-dessus, nous partageons avec la vue UserProfileScreen le nom de l'utilisateur en utilisant @EnvironmentObject et le modificateur .environmentObject, sans polluer la vue SettingsScreen avec une dépendance dont elle n'a pas besoin. Même si @EnvironmentObject est un outil puissant, il y a un problème si nous ne sommes pas prudents : SwiftUI ne sait pas si l'objet injecté est instancié, ce qui signifie que si notre objet est nul, l'application plantera à l'exécution.