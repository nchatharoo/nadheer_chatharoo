---
title: "SwiftUI: @State et @Binding"
image: "/images/cover_state_binding.jpg"
---

## @State et @Binding

En informatique, la gestion d'état fait référence au processus de surveillance et de maintien de l'état actuel d'un système.

Contrairement à UIKit, qui vous permet de mettre à jour la vue et le modèle de données indépendamment l'un de l'autre, SwiftUI est conçu de manière à ce qu'il soit impossible de modifier une vue par accident. Ainsi, chaque fois que les données changent, nous savons quel est l'état de notre application.

Un exemple simple : Vous vous connectez avec un nom d'utilisateur sur une application, qui sera affiché sur plusieurs écrans. Vous changez le nom d'utilisateur, enregistrez votre modification et revenez à la page d'accueil. Le nom d'utilisateur affiché est l'ancien !

SwiftUI nous permet de résoudre ce genre de problème avec des property wrappers.

## @State et @Binding

Considérez ce code :

![](/images/H4lSCxZ1UDlOwCLze2Uo2VawI.png)

SwiftUI ne peut pas suivre les changements des variables ou structures simples. Elles n'ont pas de mécanisme pour publier leur changement.

Si nous voulons modifier la variable name, nous pouvons utiliser @State, cette propriété redessinera la vue pour afficher la dernière modification de la variable.

![](/images/0A8Xan1gqLKfTJziLWtZKghVlMU.png)

Avec @State, SwiftUI crée un binding pour cette variable, accessible avec $name (il est décrit dans la documentation comme la valeur projetée). Il est utilisé dans le TextField, pour permettre à l'utilisateur de manipuler la variable. La structure Text utilisera la propriété name, qui est la valeur la plus à jour.

@Binding est également très simple à utiliser. Le meilleur cas est lorsqu'une vue enfant a besoin d'accéder aux données d'une vue parente :

![](/images/4P4HcWOti6HX1b6RrIkW0H39oo.png)

Dans le cas ci-dessus, ChildView et ParentView utilisent la variable number pour partager le même état.

@State et @Binding sont tous deux adaptés pour gérer l'état local (dans la même Struct ou Struct apparentée) de notre interface utilisateur. Et comme ils sont utilisés localement, une bonne pratique est de les marquer comme private, afin qu'ils ne puissent pas être modifiés de l'extérieur.