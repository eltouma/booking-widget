## Communication avec le site hôte : ##
### Objectif ###
Gérer la communication entre le widget et le site hôte grâce à des **CustomEvent**.
Le widget envoie des CustomEvent pour informer le site hôte des actions de l'utilisateur :
- `booking:success` : la réservation est confirmée.
- `booking:failed` : la réservation a échoué.
Les événements contiennent les détails de l'action effectuée :
- en cas de succès : l'id du crénau choisi, les informations sur le client et la date
- en cas d'échec : un message d'erreur et la date du créneau concerné

### Pourquoi CustomEvent ###
- C'est flexible et moderne
- Ça permet de passer des données personnalisées (ici les données clients, la date, l'id du slot)
- C'est plus adapté au code asynchrone que les callbacks
- C'est plus adapté lorsque le code est isolé (comme c'est le cas du widget)

### Problème rencontré ###
Le site hôte ne reçoit pas les events émis par le widget.
**Test effectué**
Ajout des options `bubbles: true` et `composed: true` pour permettre à l'event de remonter le DOM et de traverser le shadow DOM
`./src/widget/components/Form.tsx`
`.tsx
  bubbles: true,
  composed: true
`
Ça n'a pas fonctionné.

**Hypothèse**
Le widget n'arrive pas à traverser le DOM shadow. Le host ne reçoit pas l'event. Il est possible que ça vienne du fait que les events sont dispatchés sur `window` au lieu de l'élément hôte. Le widget s'exécute sur un DOM parent isolé ce qui empêche la propagation.

[CustomEvent vs callback](https://gomakethings.com/callbacks-vs.-custom-events-in-vanilla-js/)
