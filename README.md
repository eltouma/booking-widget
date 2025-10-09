## Wireframe et template ##
[Inspiration et wireframe](https://www.figma.com/design/qorm8UiXR1tVa1PR4iVGFH/Untitled?node-id=0-1&p=f&t=iimf6EqkAYKBkaag-0) \
[Template utilisé pour le site hôte](https://github.com/YaninaTrekhleb/restaurant-website)

## Installation ##
### Build le projet ###
```sh
npm install react react-dom react-router-dom

npm install -D tailwindcss postcss tslib rollup \
@rollup/plugin-babel @rollup/plugin-commonjs @rollup/plugin-node-resolve \
@rollup/plugin-replace @rollup/plugin-terser @rollup/plugin-typescript \
@rollup/plugin-json rollup-plugin-postcss rollup-plugin-tsconfig-paths

npm run build
```
\
**Explications des dépendances**
- `plugin-babel` permet de transpiler le code avec Babel
- `plugin-commonjs` permet d’importer les modules CJS
- `plugin-node-resolve` permet de résoudre l’adresse du module depuis les node_modules (par exemple react, react-dom)
- `plugin-replace` remplace les variables d'environnement (`process.env.NODE_ENV = "production"`)
- `plugin-terser` minifie le bundle final pour qu'il soit léger et rapide à charger sur n'importe quel site
- `plugin-typescript` permet de compiler le TypeScript pour le transformer en JavaScript
- `plugin-json` permet de lire les JSON
- `plugin-postcss` permet d'importer et de traiter du CSS dans du Javascript
- `rollup-plugin-tsconfig-paths` permet à rollup de comprendre les alias


#### Pourquoi rollup ? ####
Rollup est un bundler JavaScript qui prend l'ensemble du code soure, le compile en un fichier `.js` unique et optimisé. Ce fichier peut ensuite être facilement intégré sur n'importe quel site hôte via la balise `<script></script>`. \
Rollup est léger et optimisé : il élimine le code inutile grâce au tree-shaking et produit un bundle final plus léger que d'autres outils comme Webpack par exemple.\
Rollup c'est :
- Idéal pour généré un script unique et léger
- Parfaitement supporté par TypeScript et React
- Facilite l'intégration d'un script sur n'importe quel site hôte \
  
[tree-shaking](https://developer.mozilla.org/fr/docs/Glossary/Tree_shaking) \
[Configuration avec rollup](https://makerkit.dev/blog/tutorials/embeddable-widgets-react) \
[Rollup, l'outil pour les bundler tous !](https://buzut.net/configurer-rollup-bundles-esm-cjs/#:~:text=Comme%20dit%20pr%C3%A9c%C3%A9demment%2C%20Rollup%20est,le%20code%20qui%20sera%20utilis%C3%A9.)


#### Pourquoi Tailwind ? ####
Tailwind est un framework CSS moderne parfaitement compatible avec TypeScript et React. Tailwind adopte une approche "utility-first" qui permet d'ajouter du style directement dans le HTML ou le JSX via des classes utilitaires, ce qui rend le développement plus rapide et plus lisible. \
La gestion responsive est aussi beaucoup plus simple à gérer avec Tailwind qu'avec du CSS classique avec lequel il fallait utiliser des media queries. \
Enfin Tailwind s'intègre très facilement dans les composants React ce qui faisait de ce framework un choix intéressant pour une interface modulaire et facile à maintenir. \
[The Benefits of Using Tailwind CSS in a React Application](https://dev.to/deepeshjaindj/the-benefits-of-using-tailwind-css-in-a-react-application-3nno)


### Build le widget ###
```sh
npm i react-datepicker --save \
npm i react-hook-form \
npm i --save react-spinners/cjs \
npm i react-hot-toast

npm run build:build
```

Utilisation de composants React :
- `react-datepicker` composant pour créer un calendrier : personnalisable et facile à manipuler, idéal pour gérer les créneaux
- `react-hook-form` composant pour le formulaire : léger et permet une validation simplifiée des inputs
- `react-spinners/cjs` composant pour le loader : utile pendant le temps de chargement lors de la simulation d'un échec de paiement
- `react-hot-toast` composant pour les notifications non-intrusive pour informer l'utilisateur du succès ou de l'erreur d'une action

Comme React est un framework basé sur les composants, il était pertinent d'utiliser des outils existants et fonctionnels plutôt que de réinventer ces fonctionnalités.



## 1 - Type d’intégration du widget ##
### Objectif ###
Créer un widget et l'intégrer en temps qu'Iframe ou script embarqué sur n'importe quel site tiers.
#### Choix du script embarqué ####
J'ai choisi de faire le widget en script parce que ça présentait plusieurs avantages :
- **intégration fluide** : le widget s'exécute directement dans la page du site hôte ce qui facilite sa personnalisation et son adaptation au thème pour une unification entre le site hôte et le widget.
- **compatibilité SEO** : contrairement à l'Iframe, son contenu est rendu directement dans le DOM ce qui le rend en théorie indexable par les moteurs de recherche.
- **moins de contraintes d'isolation** : le script permet plus de contrôle sur la communication entre le widget et le site hôte.

En revanche, l'Iframe offre une meilleure isolation CSS et JavaScript mais limite les interactions et la personnalisation du contenu.
Comme mon objectif était de permettre au site hôte de personnaliser visuellement le widget pour une intégration harmonieuse, j'ai préféré utilisé un script. \
[Using Iframes vs Scripts for Embedding Components](https://blog.bitsrc.io/using-iframes-vs-scripts-for-embedding-components-e30eb569cb46)

## 2 - Gestion de la personnalisation ##
### Objectif ###
Permettre au site hôte de personnaliser le style du widget.
#### Implémentation tentée ####
J'ai commencé par modifier ma config rollup :
```mjs
postcss({
  inject: true,
  ...
})
```
Puis j'ai ajouté 2 props au WidgetContainer :
- `customClass` pour appliquer une classe CSS personnalisée
- `primaryColor` pour injecter une variable CSS pour modifier la couleur principale du widget \
widget-container.tsx
```js
interface WidgetContainerProps {
  clientKey: string;
  customClass?: string;
  primaryColor?: string;
}
export function WidgetContainer({ clientKey, customClass, primaryColor }: WidgetContainerProps) {
...
return (
    <WidgetContext.Provider value={{ isOpen, setIsOpen, clientKey }}>
      <Widget customClass={customClass} primaryColor={primaryColor} />
    </WidgetContext.Provider>
  );
}
```

widget.tsx
```js
interface WidgetProps {
  customClass?: string;
  primaryColor?: string;
}

export function Widget({ customClass, primaryColor }: WidgetProps) {
  const { isOpen, setIsOpen } = useContext(WidgetContext);
  const widgetStyle = { '--primary-color': primaryColor } as React.CSSProperties;
if (!isOpen) {
  return (
    <div className={widget-container ${customClass ?? ''}} style={widgetStyle}>
      <button
        className="widget-button"
        onClick={() => setIsOpen(true)}
      >
        Réserver un atelier
      </button>
    </div>
  );
}

return (
    <div
      className={`widget-container ${customClass ?? ''}`}
      style={widgetStyle}
    >
    ...
    </div>
)
```
Dans `styles.css`, j'ai remplacé la couleur par ma variable
```css
.widget-button {
  background-color: var(--primary-color);
  ...
}
```

**Problème** \
Mon widget a un background invisible qu'il est impossible de modifier.

**Hypothèse** \
Comme le widget utilise le shadow root, le DOM du site n'a pas accès à celui du widget : les styles définis à l'extérieur du widget (dans le DOM parent) ne peuvent pas s'appliquer à l'intérieur à cause de l'isolation.


## 3 - Communication avec le site hôte ##
### Objectif ###
Gérer la communication entre le widget et le site hôte grâce à des **CustomEvent**.
Le widget envoie des CustomEvent pour informer le site hôte des actions de l'utilisateur :
- `booking:success` : la réservation est confirmée.
- `booking:failed` : la réservation a échoué.
Les événements contiennent les détails de l'action effectuée :
- en cas de succès : l'id du crénau choisi, les informations sur le client et la date
- en cas d'échec : un message d'erreur et la date du créneau concerné

#### Pourquoi CustomEvent ####
- C'est flexible et moderne
- Ça permet de passer des données personnalisées (ici les données clients, la date, l'id du slot)
- C'est plus adapté au code asynchrone que les callbacks
- C'est plus adapté lorsque le code est isolé (comme c'est le cas du widget)

#### Problème rencontré ####
Le site hôte ne reçoit pas les events émis par le widget.

**Test effectué** \
Ajout des options `bubbles: true` et `composed: true` pour permettre à l'event de remonter le DOM et de traverser le shadow DOM
`./src/widget/components/Form.tsx`
```tsx
    bubbles: true,
    composed: true
```
Ça n'a pas fonctionné.

**Hypothèse** \
Le widget n'arrive pas à traverser le DOM shadow. Le host ne reçoit pas l'event. Il est possible que ça vienne du fait que les events sont dispatchés sur `window` au lieu de l'élément hôte. Le widget s'exécute sur un DOM parent isolé ce qui empêche la propagation.

[CustomEvent vs callback](https://gomakethings.com/callbacks-vs.-custom-events-in-vanilla-js/)


## 4 - API / données ##
### Objectif ###
Simuler un backend pour récupérer des créneaux disponibles et réserver des ateliers en gérant les cas de réussite et d'échec des réservations.
### Structure des données ###
Les données sont définies dans un fichier JSON qui représente les créneaux d'atelier. Chaque créneau contient :
```json
"slots_available": [
    {
      "id": 0,
      "date": "2025-10-07T18:00:00Z",
      "capacity": 6,
      "remaining": 6
    }
```
- `id` : identifiant unique du créneau
- `date` : date et heure de l'atelier
- `capacity` : capacité maximale
- `remaining` : nombre de places restantes

Cette structure est simple et permet de connaitre rapidement la disponibilité d'un créneau et d'ajuster le calendrier visuellement en fonction des places restantes.

### Simulation du backend ###
Le fichier mockServer.ts simule les calls API grâce à 3 fonctions principales :
- `getSlots()` \
Vérifie qu'il n'y a pas d'erreur dans le JSON (remaining < capacity). \
Retourne la liste des slots disponibles à partir du JSON. \
Filtre les dates et possède une variable `exceeding` qui empêche la réservation d'un slot 30min avant le début de l'atelier.
- `bookSlot()` \
Vérifie si le slot passé en paramètre est disponible. \
Si remaining <= 0 la réservation échoue. \
Sinon, elle décrémente le remaining et renvoie la mise à jour du slot. 
- `failBooking()` \
Sert à simuler un échec de paiement en mettant un setTimeout plus long. Dans `Form.tsx` lorsque cette fonction est appelée un loader est lancé indiquant à l'utilisateur que la transaction est en cours.


### Points d'amélioration ###
- Simuler l'échec de paiement de manière aléatoire (avec un `Math.random()`) au lieu de faire une comparaison avec l'avant dernier slot disponible. Ça reflètrai mieux les conditions réelles.
- Gérer les races conditions : si le remaining passe à 0 entre le retour de `BookSlot()` et le submit, afficher un message d'erreur au moment de la réservation.
- Permettre à l'utilisateur de réserver un créneau pour plusieurs personnes
- Permettre plusieurs créneaux dans la journée

## 5 - Expérience utilisateur ##
### Objectif ###
Assurer une interface claire et intuitive en gérant correctement les états visuels : succès, temps d'attente, erreurs, créneaux complets
### Le formulaire ###
Chaque champ du formulaire a un label clair et un message d'erreur est envoyé en cas de données manquantes ou incorrectes (adresse mail ou numéro de téléphone invalide) permettant une correction immédiate avant la soumission du formulaire.
### Légende ###
Pour que l'expérience utilisateur soit la plus intuitive possible le calendrier est coloré en fonction de la disponibiilté des créneaux :
- **vert** : créneau disponible
- **orange** : nombre de places limité
- **rouge** : créneau complet
- **bleu** : indisponible (vacances et jours fériés)
Ça permet à l'utilisateur de voir en coup d'oeil si un créneau est disponible ou non.
### Notifications ###
Lorsqu'une réservation est faite un toast s'affiche avec un message clair et concis pour indiquer à l'utilisateur si sa réservation a réussie ou échouée.
### Échec de paiement ###
L'échec de paiement est un cas à part puisque c'est le seul qui possède un loader en plus simulant une attente hors norme menant à l'échec.

## Pourquoi shadow root ? ##
J'ai choisi d'utiliser shadow root pour isoler le widget du reste du site hôte pour plusieurs raisons :
- **isolation du CSS** : le style du site hôte ne risque pas de casser l'apparence du widget et inversement. Pas de conflit.
- **isolation du JS** : on évite également les conflits avec des bibliothèques déjà utilisées par le site hôte.
- **portabilité** : le widget ne dépend pas d'une structure ou d'un style déjà existant

### Limites ###
- Les styles externes n'influencent pas le widget : on perd l'harmonie recherchée entre le style du widget et celui du site hôte
- La communication avec le site hôte via les CustomEvent reste plus compliquée
