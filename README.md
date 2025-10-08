[Inspiration et wireframe](https://www.figma.com/design/qorm8UiXR1tVa1PR4iVGFH/Untitled?node-id=0-1&p=f&t=iimf6EqkAYKBkaag-0)

## Installation ##
### Build le projet ###
```
npm install react react-dom react-router-dom

npm install -D tailwindcss postcss tslib rollup \
@rollup/plugin-babel @rollup/plugin-commonjs @rollup/plugin-node-resolve \
@rollup/plugin-replace @rollup/plugin-terser @rollup/plugin-typescript \
@rollup/plugin-json rollup-plugin-postcss rollup-plugin-tsconfig-paths

npm run build
```
\
\
**Explications des dépendances** \
`plugin-babel` permet de transpiler le code avec Babel \
`plugin-commonjs` permet d’importer les modules CJS \
`plugin-node-resolve` permet de résoudre l’adresse du module depuis les node_modules (par exemple react, react-dom) \
`plugin-replace` remplace les variables d'environnement (`process.env.NODE_ENV = "production"`) \
`plugin-terser` minifie le bundle final pour qu'il soit léger et rapide à charger sur n'importe quel site \
`plugin-typescript` permet de compiler le TypeScript pour le transformer en JavaScript \
`plugin-json` permet de lire les JSON \
`plugin-postcss` permet d'importer et de traiter du CSS dans du Javascript \
`rollup-plugin-tsconfig-paths` permet à rollup de comprendre les alias



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
```
npm install react-datepicker --save \
npm install --save react-spinners/cjs \
npm i react-hook-form \
npm i react-hot-toast

npm run build:build
```




## 1 - Type d’intégration du widget ##
### Objectif ###
Créer un widget et l'intégrer en temps qu'Iframe ou script embarqué.
#### Choix du script embarqué ####
J'ai choisi de faire le widget en script parce que ça me semblait plus sécurisé (il n'y a pas de sandbox comme pour les Iframe qui permet d'envoyer du code malveillant), le script permet également de ressortir dans les recherches puisqu'il répond au SEO. 
[Using Iframes vs Scripts for Embedding Components](https://blog.bitsrc.io/using-iframes-vs-scripts-for-embedding-components-e30eb569cb46)

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
```
    bubbles: true,
    composed: true
```
Ça n'a pas fonctionné.

**Hypothèse** \
Le widget n'arrive pas à traverser le DOM shadow. Le host ne reçoit pas l'event. Il est possible que ça vienne du fait que les events sont dispatchés sur `window` au lieu de l'élément hôte. Le widget s'exécute sur un DOM parent isolé ce qui empêche la propagation.

[CustomEvent vs callback](https://gomakethings.com/callbacks-vs.-custom-events-in-vanilla-js/)
