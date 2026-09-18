"use client";

/* Ce qu'on mesure — et la seule chose qu'on refuse.
 *
 * V2, 06/08/2026 (choix de Mihai) : plus de cadre. C'était le même moule 16px
 * que MetaProof, quatre sections plus haut, et il aplatissait en un seul bloc
 * un titre qui est déjà une opposition.
 *
 * Le refus est le sujet de la section, pas son avertissement de bas de page :
 * une page SEO qui ne promet rien de vérifiable vaut moins qu'une page qui
 * nomme ce qu'elle ne vendra pas. Il garde donc le filet accent et le corps de
 * texte plein, et ce qui l'annonce est le plus grand pas vertical de la page —
 * l'espace fait ce que la bordure faisait, comme sur web/price-method depuis
 * son dé-cadrage.
 *
 * ── CETTE SECTION PORTE LES DEUX REFUS DE LA PAGE ────────────────────────
 * 06/08/2026 (Mihai) : GeoAnswer fermait sur une bande « Ce que ça ne garantit
 * pas » qui disait déjà « personne ne peut promettre d'être cité », juste
 * avant que cette section-ci n'enchaîne sur « personne de sérieux ne peut
 * promettre la première position ». Deux refus de la même forme à une section
 * d'écart : le second désamorçait le premier.
 *
 * `measures.refusal` les tient maintenant tous les deux, avec leurs deux
 * mécanismes nommés — l'algorithme de Google et les modèles — et la phrase
 * d'engagement qui fermait GeoAnswer. C'est ce qui justifie que le paragraphe
 * soit plus long et plus gros que le reste : c'est la seule limite de la page,
 * et elle est ici. Y toucher veut dire relire geo-answer.jsx d'abord.
 *
 * Aucun score, aucune position, aucun chiffre de trafic ici. Il n'y a pas
 * encore d'historique mesuré à publier ; le jour où il y en aura, il ira dans
 * les messages.
 *
 * V3, 18/09/2026 (docs/geo-swiss-design-plan.md §3.7, et Mihai : « beaucoup de
 * texte, il faut alléger ») : même grammaire que access et approval. Les trois
 * mesures sont des cellules (libellé mono, une phrase courte), les deux cartes
 * de suivi sont devenues la table qu'elles étaient, la cadence est une bande
 * de trois cellules, et le refus se lit en deux temps : l'énoncé en corps
 * d'affiche, puis ses raisons en corps courant. `points` et `cadence` sont des
 * listes d'objets et `refusal` un {statement, text} dans fr/en.json. L'accent
 * de la section est la colonne « Aujourd'hui » : c'est celle qui bouge. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./measures.module.scss";

const Measures = () => {
    const t = useTranslations("pages.services.detail.seo.measures");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("text")}</p>

                <div className={`${section.grid12} ${styles.bento}`}>
                    {t.raw("points").map((point, i) => (
                        <div key={point.label} className={styles.point} {...reveal(2 + i)}>
                            <p className={styles.label}>{point.label}</p>
                            <p className={styles.text}>{point.text}</p>
                        </div>
                    ))}

                    {/* Le format du suivi : une table, cinq lignes. Valeurs
                        fictives, marquées « exemple » : le message est le
                        format, pas un résultat. aria-hidden : les trois
                        mesures au-dessus listent déjà chaque ligne en prose. */}
                    <div className={styles.tracking} {...reveal(5)} aria-hidden="true">
                        <div className={styles.trackHead}>
                            <span>{t("tracking.example")}</span>
                            <span>{t("tracking.baseline")}</span>
                            <span className={styles.now}>{t("tracking.today")}</span>
                        </div>
                        {t.raw("tracking.rows").map((row) => (
                            <div key={row.label} className={styles.trackRow}>
                                <span>{row.label}</span>
                                <span>{row.a}</span>
                                <span className={styles.now}>{row.b}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.cadence} {...reveal(6)}>
                        {t.raw("cadence").map((c) => (
                            <div key={c.label}>
                                <p className={styles.label}>{c.label}</p>
                                <p className={styles.cadenceValue}>{c.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Le pas le plus large de la page, puis l'énoncé sur lequel
                    elle s'arrête. */}
                <div className={`${section.grid12} ${styles.refusalBlock}`}>
                    <p className={styles.refusal} {...reveal(7)}>{t("refusal.statement")}</p>
                    <p className={styles.refusalText} {...reveal(8)}>{t("refusal.text")}</p>
                </div>
            </div>
        </section>
    );
};

export default Measures;
