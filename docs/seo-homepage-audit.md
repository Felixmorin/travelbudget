# Audit SEO de la page d'accueil GoByBudget

Date de l'audit : 2026-07-20  
URL auditee : https://gobybudget.com/  
Page locale analysee : `src/app/page.tsx` et `src/components/site/home-content.tsx`

## Sources verifiees

- Page d'accueil publique : https://gobybudget.com/
- Robots.txt : https://gobybudget.com/robots.txt
- Sitemap : https://gobybudget.com/sitemap.xml
- Pages internes testees : `/travel-budget-calculator`, `/destinations-by-budget`, `/where-can-i-travel-with-2000`, `/budget/2000`, `/from/montreal/trips-under-2000`, `/compare/portugal-vs-spain`, `/guides/how-to-calculate-trip-cost`
- Concurrents consultes : Money Fit Vacation Budget Calculator, Travelmath Travel Cost Calculator, TripBudgetCalculator.com, Budget Your Trip, Skyscanner vacation budget calculator.

## 1. Resume executif

Note SEO globale : **73/100**  
Statut : **jaune**

La page a une base saine : rendu HTML indexable, proposition de valeur comprehensible, formulaire visible dans le hero, maillage interne deja present, canonical, robots index/follow, sitemap et metadata sociale. Elle n'est pas en situation critique.

Les trois principaux problemes :

1. **Positionnement SEO trop hybride** : la page cible a la fois "travel budget calculator", "destinations by budget", "where can I travel with my budget", comparaisons et guides. C'est coherent produit, mais Google peut hesiter entre outil, hub et landing page.
2. **Contenu editorial insuffisant dans plusieurs sections** : plusieurs blocs ont un titre fort mais peu ou pas de texte explicatif, notamment "Handpicked destinations", "Guides and comparisons", "Popular estimates" et "Choose your real departure city".
3. **Confiance/E-E-A-T encore trop discrete** : la methodologie est liee, mais l'accueil ne montre pas assez les sources, la frequence de mise a jour, les limites des estimations, la divulgation affiliation et les exemples de calcul.

Les trois meilleures opportunites :

1. **Assumer un mot-cle principal de homepage : "where can I travel with my budget"**. Cette requete colle mieux a l'accueil que "travel budget calculator", qui doit rester la page outil.
2. **Transformer l'accueil en hub d'orientation budget-first** avec liens vers calculateur, destinations par budget, villes de depart, comparaisons et guides.
3. **Ajouter une section de demonstration chiffrage + methodologie courte** pour capter a la fois l'intention informationnelle et transactionnelle.

Priorite dans la strategie SEO globale : **tres elevee**. L'accueil doit devenir la page de marque + hub principal, mais ne doit pas cannibaliser `/travel-budget-calculator` ni les pages programmatiques.

## 2. Intention de recherche et positionnement

Intention principale actuelle : **decouverte de destinations selon un budget total**.

Intentions secondaires :

- calculer le cout total d'un voyage ;
- comparer plusieurs destinations ;
- trouver des destinations abordables depuis une ville de depart ;
- comprendre les couts inclus dans un voyage ;
- entrer dans le funnel affiliation Booking.com / Aviasales ;
- collecter des emails pour inspiration ou alertes budget.

La proposition de valeur est comprise rapidement grace au H1 "Find where your travel budget can take you" et au formulaire. Google peut identifier le sujet general, mais le title met en premier "Travel Budget Calculator", ce qui entre en tension avec la page dediee `/travel-budget-calculator`.

Mot-cle principal recommande pour l'accueil :

**where can I travel with my budget**

Pourquoi : c'est le meilleur compromis entre intention de decouverte, page d'accueil, formulaire budget-first et liens vers resultats. La page calculateur doit posseder "travel budget calculator" et "trip cost calculator".

Mots-cles secondaires a integrer naturellement :

- find a destination by budget ;
- travel destinations by budget ;
- destination by budget ;
- affordable destinations by budget ;
- compare travel costs ;
- total trip cost estimate ;
- budget travel planner ;
- where can I travel with $2000 ;
- calculateur de budget voyage ;
- ou voyager avec mon budget ;
- destination selon mon budget.

Positionnement distinct recommande :

> GoByBudget is a budget-first travel discovery tool: enter your total trip budget, departure city, duration, and travel style to find realistic destinations with flights, stays, food, local transport, and activities estimated together.

## 3. Balise title

Title actuel : **Travel Budget Calculator & Destinations by Budget | GoByBudget**  
Longueur approx. : **66 caracteres**  
Evaluation : correct techniquement, clair, marque presente, longueur acceptable. Le probleme est strategique : il donne la priorite au mot-cle "Travel Budget Calculator", deja mieux servi par `/travel-budget-calculator`.

Risques :

- cannibalisation avec la page outil ;
- title un peu generique face a des SERP ou les utilisateurs demandent "where can I travel with my budget" ;
- "Destinations by Budget" est pertinent, mais secondaire.

Versions recommandees :

| Rang | Title propose | Mot-cle principal | Longueur approx. | Pourquoi |
| --- | --- | --- | ---: | --- |
| 1 | Where Can I Travel With My Budget? | GoByBudget | where can I travel with my budget | 51 | Aligne l'accueil sur l'intention la plus distinctive, forte promesse de clic. |
| 2 | Find Destinations by Budget | GoByBudget | find destinations by budget | 42 | Clair, court, moins cannibalisant que "calculator". |
| 3 | Travel Destinations by Budget & Trip Cost Estimates | GoByBudget | travel destinations by budget | 64 | Plus descriptif, bon pour longue traine, mais moins direct. |

## 4. Meta description

Meta description actuelle :  
**Enter your budget, departure city, trip length, and travel style to find affordable destinations with realistic total trip costs.**  
Longueur approx. : **129 caracteres**.

Elle est bonne : claire, benefice concret, budget + depart + duree + style. Elle ne mentionne pas explicitement la comparaison, les categories de couts, ni le calculateur. Elle peut etre rendue plus orientee clic.

Descriptions proposees :

1. **Enter your budget, departure city, trip length, and travel style to find destinations with realistic estimates for flights, stays, food, transport, and activities.**
2. **See where your travel budget can take you. Compare destinations by total trip cost, including flights, hotels, food, transport, and activities.**
3. **Use GoByBudget to find affordable destinations, compare trip costs, and build a realistic travel budget before you book.**

## 5. H1 et structure des titres

H1 actuel : **Find where your travel budget can take you**  
Evaluation : fort, naturel, tres proche de l'intention cible. A conserver ou renforcer legerement.

Structure actuelle observee :

- H1 : Find where your travel budget can take you
- H2 : Handpicked destinations with realistic total trip estimates
- H2 : Every result shows what is included
- H2 : Guides and comparisons for choosing smarter
- H2 : Popular estimates people compare first
- H2 : Choose your real departure city
- H2 : From inspiration to a realistic shortlist
- H2 : Frequently Asked Questions
- H2 : Discover destinations your budget can actually support

Problemes :

- "World's finest budget escapes" est trop editorial/premium et moins SEO.
- "Guides and comparisons for choosing smarter" est vague.
- "Popular estimates people compare first" manque de mots-cles.
- "Choose your real departure city" est utile, mais devrait inclure "travel budget from..." ou "from your city".
- La FAQ actuelle ne couvre que 3 questions, insuffisant pour ce type de page.

Structure recommandee :

| Niveau | Titre recommande | Mot-cle / intention |
| --- | --- | --- |
| H1 | Find where you can travel with your budget | where can I travel with my budget |
| H2 | Search destinations by total trip budget | destination by budget |
| H2 | How GoByBudget estimates your trip cost | trip cost estimate |
| H3 | Flights from your departure city | flights, departure city |
| H3 | Hotels and stays | hotels, accommodation |
| H3 | Food, local transportation, and activities | daily budget |
| H2 | Compare affordable destinations by budget | compare travel costs |
| H3 | Trips under $1,000 CAD | budget pages |
| H3 | Trips under $2,000 CAD | budget pages |
| H3 | Trips under $3,000 CAD | budget pages |
| H2 | Popular trip cost examples | how much does a trip cost |
| H2 | Start from your departure city | travel budget from Montreal/Toronto/etc. |
| H2 | Travel budget calculator and planning tools | travel budget calculator |
| H2 | Why travelers can use these estimates with confidence | methodology, E-E-A-T |
| H2 | Travel budget FAQ | FAQPage |
| H2 | Start planning with your budget | conversion |

## 6. Analyse du contenu

Forces :

- Le hero fait bien le lien entre budget total, ville de depart, duree, voyageurs et style.
- Les couts inclus sont explicitement listes : flights, stays, daily spend, activities.
- Les exemples de destinations donnent des montants concrets.
- La page dirige vers des pages fortes : destinations, comparaisons, villes de depart, calculateur, methodologie.

Faiblesses :

- Trop de sections ressemblent a des cartes de navigation sans texte d'explication.
- Les exemples ne disent pas clairement si les montants sont par personne, par voyage, pour combien de voyageurs, ni quelles hypotheses sont retenues.
- La section "How it works" arrive trop bas.
- La confiance est surtout dans la page methodologie, pas assez dans l'accueil.
- Pas de module email visible sur l'accueil, alors que l'objectif inclut les inscriptions.
- Les CTA d'affiliation sont absents de l'accueil. C'est acceptable si l'accueil ne doit pas vendre trop tot, mais il faut au moins preparer le chemin vers resultats puis Booking/Aviasales.

Sections a modifier :

| Section | Action | Modification exacte |
| --- | --- | --- |
| Hero | Reecrire legerement | Garder l'intention "where can I travel with my budget" et ajouter "total trip cost". |
| Hero links | Renommer | Remplacer "Open calculator" par "Use the travel budget calculator". |
| Handpicked destinations | Developper | Ajouter 2 phrases expliquant les hypotheses des exemples. |
| Transparent estimates | Conserver + renforcer | Ajouter assurance, buffers et devises dans le texte. |
| Guides and comparisons | Renommer | "Compare travel costs before choosing a destination". |
| Popular estimates | Developper | Ajouter une phrase sur les couts inclus et la ville de depart. |
| Places to start from | Developper | Ajouter "from Montreal, Toronto, Vancouver..." dans le copy. |
| How it works | Remonter | Le placer juste apres le hero. |
| FAQ | Developper | Passer de 3 a 8 questions. |
| Email | Ajouter | Module "Get budget trip ideas by email". |

Texte propose pour le hero :

**H1**  
Find where you can travel with your budget

**Sous-titre**  
Enter your total trip budget, departure city, trip length, number of travelers, and travel style. GoByBudget compares realistic destination estimates for flights, stays, food, local transport, and activities before you start booking.

**Intro courte sous le formulaire**  
GoByBudget is built for travelers who know what they can spend but are not sure where that budget works best. Start with your real budget, then compare destinations by total estimated trip cost instead of checking flights, hotels, and daily expenses in separate tabs.

## 7. Analyse semantique

Entites et concepts a mentionner :

- GoByBudget ;
- travel budget calculator ;
- trip cost calculator ;
- destination comparison ;
- departure city ;
- Montreal, Toronto, Vancouver, Calgary, New York ;
- CAD, USD, GBP ;
- flights, hotels, stays, accommodation ;
- food, restaurants, groceries ;
- local transportation, transit, taxis, rideshare ;
- activities, tours, tickets, attractions ;
- travel insurance ;
- daily budget ;
- total trip cost ;
- travel duration ;
- comfort level / travel style ;
- affordable destinations ;
- realistic travel estimates ;
- Booking.com ;
- Aviasales.

Variantes a integrer naturellement :

- US : vacation budget calculator, trip cost calculator, affordable vacation destinations.
- Canada : travel budget from Montreal, CAD trip budget, flights from Toronto.
- UK : holiday budget calculator, GBP travel budget, affordable holiday destinations.
- FR : calculateur de budget voyage, ou voyager avec mon budget, combien coute un voyage, destination selon mon budget.

Liste de mots-cles a integrer sans bourrage :

- where can I travel with my budget ;
- find destinations by budget ;
- travel destinations by budget ;
- affordable destinations by budget ;
- budget travel planner ;
- compare travel costs ;
- total trip cost estimate ;
- daily travel budget ;
- flights and hotel estimate ;
- trip budget from Montreal ;
- trip budget from Toronto ;
- calculate trip cost ;
- calculateur de budget voyage ;
- destination selon mon budget ;
- combien coute un voyage.

## 8. Maillage interne

Le maillage actuel est solide mais perfectible. Liens presents : calculateur, destinations by budget, destinations, tools, travel extras, guides, about, methodology, pages de depart, comparaisons, destinations, legal. Bon point : beaucoup de liens sont dans le HTML initial.

Problemes :

- Plusieurs ancres sont trop generiques : "Read more", "Open calculator", "Find my destinations".
- La page `/travel-budget-calculator` est liee, mais pourrait recevoir une ancre plus descriptive.
- Les pages `/budget/1000`, `/budget/2000`, `/budget/3000`, `/budget/5000` ne sont pas assez mises en avant depuis l'accueil.
- Les pages "travel cost" et "destination travel budget" sont absentes du contenu d'accueil.
- Methodologie et affiliation sont surtout dans le footer, pas dans une section de confiance contextuelle.

Plan de maillage recommande :

| Section de la page d'accueil | Page cible | Ancre recommandee | Objectif SEO | Priorite |
| --- | --- | --- | --- | --- |
| Hero | `/results?...` | Find destinations within my budget | Conversion organique | Haute |
| Hero | `/travel-budget-calculator` | Use the travel budget calculator | Soutenir page outil | Haute |
| How it works | `/travel-budget-calculator` | calculate your total trip cost | Mot-cle outil | Haute |
| Destinations by budget | `/destinations-by-budget` | browse destinations by budget | Hub budget | Haute |
| Budget examples | `/budget/2000` | where you can travel for $2,000 CAD | Longue traine budget | Haute |
| Budget examples | `/budget/3000` | trips you can take with $3,000 CAD | Longue traine budget | Moyenne |
| Departure city | `/from/montreal` | travel budget ideas from Montreal | Origine | Haute |
| Departure city | `/from/toronto` | affordable trips from Toronto | Origine | Haute |
| Comparison | `/compare/portugal-vs-spain` | Portugal vs Spain travel budget | Comparaison | Moyenne |
| Comparison | `/compare/thailand-vs-vietnam` | Thailand vs Vietnam travel costs | Comparaison | Moyenne |
| Methodology | `/methodology` | how GoByBudget estimates trip costs | E-E-A-T | Haute |
| Trust | `/affiliate-disclosure` | how affiliate links work | Confiance | Moyenne |
| Guides | `/guides/how-to-calculate-trip-cost` | how to calculate trip cost | Informationnel | Haute |
| Destination cards | `/destinations/lisbon/travel-budget` | Lisbon travel budget | Destination + budget | Moyenne |
| Final CTA | `/results?...` | compare destinations by total trip cost | Conversion | Haute |

## 9. CTA et conversion SEO

CTA principal recommande : **Find destinations within my budget**.

Le CTA ne devrait pas orienter d'abord vers l'inscription courriel. Pour le trafic organique non-marque, l'intention principale est d'obtenir une reponse budget/destination. Le CTA principal doit donc conduire vers une recherche/resultats ou le calculateur. L'email doit etre secondaire, apres demonstration de valeur.

CTA actuels :

- "Find my destinations" : bon, mais pourrait etre plus specifique.
- "Open calculator" / "Calculate budget" : correct mais moins oriente resultat.
- "Read more" : trop generique.

CTA proposes en anglais :

- Primary : **Find destinations within my budget**
- Secondary : **Use the travel budget calculator**
- Comparison : **Compare trip costs**
- Methodology : **See how estimates are calculated**
- Email : **Get budget trip ideas by email**
- Affiliate transition on result pages : **Check live hotel prices** / **Compare flight deals**

CTA proposes en francais si version FR :

- **Trouver des destinations selon mon budget**
- **Calculer mon budget voyage**
- **Comparer les couts de voyage**
- **Voir la methodologie**
- **Recevoir des idees de voyage par courriel**

## 10. Confiance et E-E-A-T

Signaux presents :

- page methodologie ;
- footer avec privacy, terms, affiliate disclosure ;
- mention affiliation dans le footer ;
- exemples de couts inclus ;
- destination data et city data visibles dans le produit.

Signaux a ajouter en priorite sur l'accueil :

1. **Mini-methodologie visible** : "Our estimates combine origin-specific flight assumptions, accommodation ranges, food, local transport, activities, and travel style multipliers."
2. **Frequence de mise a jour** : "Updated regularly as destination and travel cost assumptions change."
3. **Limites claires** : "Live fares and hotel prices can change; use estimates as planning ranges before booking."
4. **Divulgation affiliation contextuelle** : "GoByBudget may earn from partner links such as Booking.com and Aviasales at no extra cost to you."
5. **Exemple de calcul** : afficher un mini breakdown pour Lisbon 10 days from Montreal : flights, stays, food, transport, activities, buffer.
6. **Auteur/editeur** : ajouter lien "About GoByBudget" ou "Editorial approach" depuis la section confiance.

Texte propose :

> GoByBudget estimates are planning ranges, not live quotes. We combine destination cost data, origin-specific flight assumptions, accommodation ranges, food, local transportation, activities, travel duration, and comfort level to create a realistic total trip cost. Before booking, always verify live prices with travel partners.

## 11. Analyse technique SEO

Elements verifies :

- HTTP 200 sur l'accueil.
- Title et meta description presents.
- Robots meta : `index, follow`.
- Canonical : `https://gobybudget.com`.
- HTML initial contient le H1, le contenu principal, les liens et le JSON-LD.
- `lang="en"` present.
- Open Graph et Twitter Cards presents.
- Favicon et apple icon presents.
- Robots.txt accessible et autorise le crawl.
- Sitemap XML accessible avec pages principales et programmatiques.
- JSON-LD present : `WebSite` et `Organization`.
- Images rendues via Next Image, alt presents.

Problemes classes :

| Probleme | Impact SEO | Difficulte | Urgence | Solution recommandee |
| --- | --- | --- | --- | --- |
| Pas de `FAQPage` alors que FAQ visible | Moyen | Faible | Haute | Ajouter JSON-LD FAQ uniquement pour les questions visibles. |
| Pas de `WebPage` / `SoftwareApplication` contextualise sur l'accueil | Moyen | Faible | Moyenne | Ajouter `WebPage`; reserver `WebApplication` a `/travel-budget-calculator` ou a une section outil claire. |
| Canonical sans slash final alors que siteConfig genere souvent `/` | Faible | Faible | Moyenne | Standardiser canonical avec ou sans slash sur toutes les pages. |
| Images Unsplash servies en `w=1920` pour cartes | Moyen performance | Moyen | Moyenne | Definir `sizes` adaptes aux grilles et eviter 1920px sur cartes 4 colonnes. |
| Cache HTML `max-age=0, must-revalidate` | Faible a moyen | Moyen | Basse | OK pour contenu dynamique, mais surveiller TTFB. Utiliser cache/revalidate si contenu statique. |
| Pas de hreflang alors que opportunite FR existe | Moyen international | Moyen | Moyenne | Ajouter hreflang uniquement apres creation de vraies pages FR equivalentes. |
| Pas de donnees CWV dans cet audit | Inconnu | - | Haute | Verifier dans Search Console + PageSpeed/Lighthouse en mobile. |
| Ancres generiques "Read more" | Moyen | Faible | Haute | Remplacer par ancres descriptives. |
| Descriptions de sections vides dans le composant | Moyen | Faible | Haute | Remplir les props `copy` vides. |

## 12. Donnees structurees

Actuellement : `WebSite` et `Organization`. C'est conforme mais minimal.

Schemas recommandes :

- `Organization` : oui.
- `WebSite` : oui.
- `WebPage` : oui.
- `FAQPage` : oui, si les 6-8 FAQ sont visibles.
- `SearchAction` : seulement si une vraie URL de recherche stable accepte une requete utilisateur. Ici, les resultats reposent sur parametres budget/origin/days ; a eviter tant que ce n'est pas un search box textuel standard.
- `SoftwareApplication` / `WebApplication` : plutot sur `/travel-budget-calculator`. Sur l'accueil seulement si la section outil devient une demonstration substantielle.
- `BreadcrumbList` : pas necessaire pour l'accueil.
- `ItemList` : possible pour une liste visible de destinations populaires, mais optionnel.

Exemple JSON-LD recommande pour l'accueil :

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Find where you can travel with your budget",
    "url": "https://gobybudget.com/",
    "description": "Enter your total trip budget, departure city, trip length, and travel style to compare destinations by realistic total trip cost.",
    "isPartOf": {
      "@type": "WebSite",
      "name": "GoByBudget",
      "url": "https://gobybudget.com/"
    },
    "about": [
      "Travel budget planning",
      "Trip cost estimates",
      "Destinations by budget"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does GoByBudget include in a trip budget?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GoByBudget estimates flights, accommodation, food, local transportation, activities, and travel style assumptions to show a realistic total trip cost."
        }
      },
      {
        "@type": "Question",
        "name": "Are GoByBudget estimates live booking prices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Estimates are planning ranges. Flight and hotel prices can change, so travelers should verify live prices before booking."
        }
      }
    ]
  }
]
```

## 13. Images et SEO visuel

Images observees :

- logo GoByBudget, alt "GoByBudget.com" ;
- images de Lisbon, Mexico City, Paris, Bangkok avec alt destination ;
- images de guides/comparaisons avec alt repris du titre ;
- Open Graph image presente.

Problemes :

- Les images de cartes sont optimisees par Next, mais semblent servies avec variante large `w=1920`; verifier `sizes`.
- Les alt "travel inspiration" sont corrects mais pourraient etre plus utiles pour budget/trip cost.
- Les images Unsplash sont attractives mais generiques. Pour un outil budget, des captures du produit/resultats seraient plus convaincantes qu'une page 100 % inspiration.

Alt proposes :

- Lisbon : **Lisbon travel budget estimate with flights, stays, food, and activities**
- Mexico City : **Mexico City affordable trip estimate for a 10 day budget**
- Paris : **Paris trip cost estimate with flights and daily expenses**
- Bangkok : **Bangkok travel budget estimate for a longer affordable trip**
- Portugal vs Spain : **Portugal vs Spain travel cost comparison**
- Mexico vs Colombia : **Mexico vs Colombia budget travel comparison**
- Product screenshot : **GoByBudget results comparing destinations by total trip cost**

## 14. FAQ SEO recommandee

1. **What does GoByBudget include in a travel budget?**  
GoByBudget estimates flights, accommodation, food, local transportation, activities, and travel style assumptions to show a total trip cost.

2. **Is GoByBudget a travel budget calculator?**  
Yes. You can use it to estimate trip costs, but the homepage is designed to help you discover where your budget can take you.

3. **Are the estimates live booking prices?**  
No. They are planning estimates. Flight and hotel prices change often, so you should verify live prices before booking.

4. **Can I choose my departure city?**  
Yes. GoByBudget supports major departure cities such as Montreal, Toronto, Vancouver, Calgary, Ottawa, New York, and more.

5. **Can I compare destinations with the same budget?**  
Yes. Enter your budget and trip details to compare destinations on flights, stays, daily costs, and activities.

6. **Which currencies does GoByBudget support?**  
The experience supports CAD and should also surface USD and GBP where relevant for US and UK travelers.

7. **Does the estimate include flights and hotels?**  
Yes. Flights and accommodation are included along with food, local transport, and activities.

8. **How often are travel costs updated?**  
Estimates should be updated regularly as destination costs, flight assumptions, and accommodation ranges change. Add the exact update frequency if available.

9. **Can I find affordable destinations under a fixed budget?**  
Yes. Use budget pages such as trips under $1,000, $2,000, $3,000, or $5,000 CAD to find realistic options.

## 15. Comparaison concurrentielle

Types de concurrents :

- Calculateurs purs : Money Fit, FNBO, Travel Money Oz, TripBudgetCalculator.com.
- Sites cout de voyage : Budget Your Trip.
- Comparateurs / inspiration : Skyscanner, Kayak Explore, Google Flights Explore.
- Blogs budget travel : guides destinationnels et listes "cheap places to travel".
- Outils de planification : apps de budget, spreadsheets, itinerary planners.

Ce que les concurrents expliquent mieux :

- Money Fit explique tres clairement les couts inclus, les couts oublies et la notion de savings target.
- Budget Your Trip a une perception de profondeur data par pays et categories de cout.
- Skyscanner connecte fortement budget, destination et possibilite de voyage.
- Les blogs captent mieux les questions longues : "how much does a trip cost", "best destinations under X".

Ce que GoByBudget fait mieux ou peut faire mieux :

- Combiner budget total + ville de depart + duree + style + destinations.
- Creer un pont naturel entre contenu SEO et conversion affiliation.
- Produire des pages programmatiques par budget, origine, destination et comparaison.

Positionnement unique defendable :

> Unlike generic travel budget calculators that ask you to already know your destination, GoByBudget starts with your real budget and shows where that money can realistically take you from your departure city.

## 16. Risque de cannibalisation

Risque principal : **`/` vs `/travel-budget-calculator`**.

Repartition recommandee :

| Mot-cle | Page proprietaire |
| --- | --- |
| where can I travel with my budget | `/` |
| find destinations by budget | `/` ou `/destinations-by-budget` selon SERP |
| travel destinations by budget | `/destinations-by-budget` |
| travel budget calculator | `/travel-budget-calculator` |
| trip cost calculator | `/travel-budget-calculator` |
| vacation budget calculator | `/travel-budget-calculator` |
| how much does a trip cost | `/guides/how-to-calculate-trip-cost` ou pages `/travel-cost/...` |
| compare travel costs | `/compare` et pages `/compare/...` |
| where can I travel with $2000 | `/where-can-i-travel-with-2000`, `/budget/2000` |
| trips from Montreal under $2000 | `/from/montreal/trips-under-2000` |
| Lisbon travel budget | `/destinations/lisbon/travel-budget` |

Comment eviter la cannibalisation :

- Retirer "Travel Budget Calculator" du debut du title de l'accueil.
- Utiliser l'accueil comme hub d'orientation.
- Lier vers `/travel-budget-calculator` avec l'ancre exacte "travel budget calculator".
- Lier vers `/destinations-by-budget` avec "destinations by budget".
- Lier vers pages budget avec ancres budget exactes.
- Ne pas developper sur l'accueil un contenu trop long sur "how to calculate trip cost"; garder cela pour le guide.

## 17. Architecture recommandee de l'accueil

| Section | Objectif | Titre | Contenu | CTA | Mot-cle/intention | Lien interne | Importance SEO | Importance conversion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hero | Reponse immediate | Find where you can travel with your budget | Formulaire + promesse complete trip cost | Find destinations within my budget | where can I travel with my budget | `/results` | Tres haute | Tres haute |
| Proposition de valeur | Clarifier differenciation | Start with budget, not a destination | 3 phrases sur budget-first | Use the calculator | find destination by budget | `/travel-budget-calculator` | Haute | Haute |
| How it works | Reduire friction | How GoByBudget works | 3 etapes : budget, origin, compare | Compare trip costs | budget travel planner | `/travel-budget-calculator` | Haute | Haute |
| Demo calculateur | Prouver l'outil | See a sample trip cost estimate | Exemple Lisbon 10 days from Montreal | View full estimate | total trip cost | `/destinations/lisbon/travel-budget` | Haute | Haute |
| Examples by budget | Capturer longue traine | Popular destinations by budget | $1k, $2k, $3k, $5k | Browse destinations by budget | destinations by budget | `/destinations-by-budget` | Tres haute | Haute |
| Cost categories | Couvrir semantique | What is included in each estimate | Flights, hotels, food, transport, activities, insurance | See methodology | trip cost estimate | `/methodology` | Haute | Moyenne |
| Comparisons | Pousser pages compare | Compare travel costs before choosing | Portugal vs Spain, Thailand vs Vietnam | Compare destinations | compare travel costs | `/compare` | Moyenne | Moyenne |
| Popular guides | Profondeur | Learn how to plan a realistic trip budget | Guides "how to calculate", hidden costs | Read trip cost guide | how much does a trip cost | `/guides/how-to-calculate-trip-cost` | Haute | Moyenne |
| Trust | E-E-A-T | Why travelers can trust the estimates | Methodologie, update, limits, affiliation | See methodology | realistic travel estimates | `/methodology` | Haute | Moyenne |
| Email | Retention | Get budget trip ideas by email | Signup court | Get trip ideas | email lead | API lead | Faible SEO | Haute |
| FAQ | Longue traine | Travel budget FAQ | 8 questions visibles | Start planning | FAQ | - | Haute | Moyenne |
| Final CTA | Conversion | Ready to compare destinations? | Recap benefice | Find destinations within my budget | conversion | `/results` | Moyenne | Tres haute |

## 18. Recommandations de redaction

Title :

> Where Can I Travel With My Budget? | GoByBudget

Meta description :

> See where your travel budget can take you. Compare destinations by total trip cost, including flights, hotels, food, transport, and activities.

H1 :

> Find where you can travel with your budget

Sous-titre hero :

> Enter your total trip budget, departure city, trip length, number of travelers, and travel style. GoByBudget compares realistic destination estimates for flights, stays, food, local transport, and activities before you start booking.

CTA principal :

> Find destinations within my budget

CTA secondaire :

> Use the travel budget calculator

Paragraphe d'introduction :

> Planning a trip is easier when you start with the amount you can actually spend. GoByBudget helps you compare destinations by realistic total trip cost, so you can see whether your budget works better for a city break in Europe, a longer stay in Asia, a warm-weather escape, or a closer trip from your departure city.

Section "How it works" :

> **How GoByBudget works**  
> Start with your total budget, choose your departure city, set your trip length and travel style, then compare destinations using the same cost categories. Each estimate combines flights, stays, food, local transportation, and activities so you can shortlist places that fit your budget before checking live prices.

Section confiance :

> **How we estimate trip costs**  
> GoByBudget estimates are built from destination cost assumptions, origin-specific flight ranges, accommodation levels, daily food and local transportation costs, activity budgets, trip duration, and travel style. The result is a planning estimate, not a live quote. Prices can change before booking, so use GoByBudget to shortlist destinations and verify live prices with partners before you buy.

CTA courriel :

> **Get realistic trip ideas for your budget**  
> Receive destination ideas, budget examples, and new comparison guides based on realistic total trip costs.  
> CTA: **Send me budget trip ideas**

FAQ : utiliser les 8 questions de la section 14.

## 19. Plan d'action priorise

| Priorite | Action | Impact attendu | Effort | Delai recommande | KPI a suivre |
| --- | --- | --- | --- | --- | --- |
| P0 | Changer le title de l'accueil vers "Where Can I Travel With My Budget?" | Moins de cannibalisation, CTR plus fort | Faible | Immediat | CTR, impressions homepage |
| P0 | Remplacer H1/sous-titre hero par la version cible | Meilleure pertinence intentionnelle | Faible | Immediat | Engagement, search clicks |
| P0 | Remplacer CTA principal par "Find destinations within my budget" | Plus d'utilisations du formulaire | Faible | Immediat | Search submit rate |
| P0 | Remplir les `copy=""` des sections | Plus de contenu indexable utile | Faible | Immediat | Temps page, impressions |
| P1 | Ajouter une mini-section methodologie + limites | E-E-A-T, confiance | Moyen | Cette semaine | Scroll depth, clicks methodology |
| P1 | Ajouter 6-8 FAQ visibles + FAQPage JSON-LD | Longue traine, rich eligibility | Moyen | Cette semaine | FAQ impressions, rankings |
| P1 | Renommer les ancres generiques "Read more" | Meilleur maillage interne | Faible | Cette semaine | Clics internes |
| P1 | Ajouter liens vers `/budget/1000`, `/budget/2000`, `/budget/3000`, `/budget/5000` | Soutien pages budget | Faible | Cette semaine | Impressions pages budget |
| P2 | Ajouter capture produit/resultats | Confiance et conversion | Moyen | Ce mois-ci | Form starts, conversion |
| P2 | Ajouter module email | Leads | Moyen | Ce mois-ci | Email signup rate |
| P2 | Ajouter liens contextuels vers Booking/Aviasales depuis resultats, pas hero | Revenus affiliation | Moyen | Ce mois-ci | Affiliate CTR, revenue/session |
| P2 | Optimiser `sizes` des images cartes | Performance mobile | Moyen | Ce mois-ci | LCP, image bytes |
| Test | A/B tester CTA "Find destinations within my budget" vs "See where I can travel" | Conversion | Moyen | 2 semaines | Submit rate |
| Test | Tester title 1 vs title 2 | CTR SEO | Moyen | 4-6 semaines | GSC CTR |
| Contenu | Creer pages "where can I travel with $X from [city]" | Longue traine | Eleve | Ce mois-ci | Organic clicks |
| Technique | Verifier CWV dans PageSpeed et GSC | Stabilite SEO | Faible | Cette semaine | LCP, INP, CLS |

Corrections immediates :

- title ;
- H1/sous-titre ;
- CTA principal ;
- textes de sections vides ;
- ancres "Read more".

Ameliorations cette semaine :

- FAQ complete ;
- FAQPage schema ;
- mini-methodologie ;
- liens budget/origine/comparaison.

Ameliorations ce mois-ci :

- email capture ;
- capture produit ;
- optimisation images ;
- renforcement pages programmatiques liees.

## 20. Verdict final

Plus grosse faiblesse SEO : **la page ne choisit pas assez clairement son territoire principal entre calculateur, destination finder et hub editorial**. Le title pousse "travel budget calculator", alors que la page outil existe deja.

Meilleure opportunite de croissance : **devenir la meilleure page "where can I travel with my budget"**, puis redistribuer l'autorite vers calculateur, budget pages, departure pages et comparaisons.

Changement unique avec le plus d'impact probable : **repositionner l'accueil autour de "Find where you can travel with your budget" / "Where Can I Travel With My Budget?" et deplacer "travel budget calculator" vers le CTA et la page outil**.

Les cinq actions a executer en premier :

1. Changer le title en **Where Can I Travel With My Budget? | GoByBudget**.
2. Mettre le H1 en **Find where you can travel with your budget**.
3. Reecrire le sous-titre hero pour inclure total trip budget, departure city, trip length, travel style, flights, stays, food, transport, activities.
4. Ajouter une section methodologie courte visible sur l'accueil avec lien vers `/methodology`.
5. Ajouter une FAQ de 8 questions avec JSON-LD `FAQPage`.

Potentiel apres optimisation : **85-88/100**. La page peut devenir un hub SEO performant si elle garde une intention principale nette, renforce sa confiance, ajoute du contenu utile sans surcharger l'interface et distribue mieux l'autorite vers les pages monetisables.
