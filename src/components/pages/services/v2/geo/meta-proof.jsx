"use client";

/* La méta-démonstration : cette page applique la méthode qu'elle vend.
 *
 * V2, 06/08/2026 (choix de Mihai) : le cadre 16px a sauté. Il était le même
 * que celui de Measures quatre sections plus bas — le même moule deux fois, en
 * sandwich autour des chiffres — et surtout il ne prouvait rien.
 *
 * La copie dit « Affichez le code source de cette page : tout y est. » La
 * section le montre maintenant : un extrait de la réponse HTTP réelle, à
 * gauche, et les quatre points à droite renvoyant chacun aux lignes qu'il
 * revendique. C'est la seule section de la page où la forme démontre au lieu
 * d'affirmer, et le prix à payer est une servitude : l'extrait doit rester
 * vrai. Tout est dans src/data/seo-source-excerpt.js, avec sa procédure.
 *
 * Le panneau de code est du texte, pas une image : il part dans le HTML servi
 * comme le reste, ce qui est précisément ce que les lignes 11–13 affirment.
 * Un <pre> ferait déborder la page sur mobile, donc chaque ligne est son
 * propre élément et le débordement est confié à un conteneur qui défile seul.
 *
 * HARG-302 : titrée « Architecture & source » dans le fil Contenu → Architecture
 * → Source → Moteur de réponse (IA) demandé pour /geo. Les quatre points se
 * lisent déjà en deux moitiés : hreflang + schema.org sont structurels
 * (Architecture), « tout est dans le HTML » + l'invitation à voir la source
 * sont la preuve elle-même (Source). Les séparer casserait le renvoi numéroté
 * de chaque point vers ses lignes dans l'extrait — un seul bloc de preuve,
 * donc les deux mots du fil sur une seule section plutôt que sur deux.
 *
 * V3, 18/09/2026 (Mihai : « beaucoup de texte, il faut alléger ») : même
 * grammaire que access et approval. L'extrait est posé sur .grid12 (colonnes
 * 1–7) dans une cellule à filets, les points passent à droite en cellules :
 * renvoi de lignes en mono, un titre, une phrase. `points` est devenu une
 * liste de {title, text} dans fr/en.json, même ordre, même contrat avec
 * SOURCE_EXCERPT.refs. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {SOURCE_EXCERPT} from "@/data/seo-source-excerpt";
import styles from "./meta-proof.module.scss";

const MetaProof = () => {
    const t = useTranslations("pages.services.detail.seo.metaProof");
    const reveal = useReveal();
    const points = t.raw("points");

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("text")}</p>

                <div className={`${section.grid12} ${styles.split}`}>
                    {/* aria-hidden : les points disent en prose ce que
                        l'extrait montre, donc le faire lire ligne à ligne par
                        un lecteur d'écran doublerait l'argument sans l'ajouter.
                        Le texte reste dans le HTML — c'est ce que lisent les
                        moteurs, et c'est tout l'intérêt. */}
                    <div className={styles.code} {...reveal(2)} aria-hidden="true">
                        <p className={styles.label}>
                            <span>{t("sourceLabel")}</span>
                            <span className={styles.url}>{SOURCE_EXCERPT.url.replace("https://", "")}</span>
                        </p>
                        <div className={styles.codeScroll}>
                            {SOURCE_EXCERPT.lines.map((line, i) => (
                                <span
                                    key={line.text}
                                    className={line.proven ? styles.lineProven : styles.line}
                                >
                                    <span className={styles.ln}>{i + 1}</span>
                                    <span className={styles.lineText}>{line.text}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <ul className={styles.notes}>
                        {points.map((point, i) => (
                            <li key={point.title} className={styles.note} {...reveal(3 + i)}>
                                <span className={styles.ref}>{t("lines")} {SOURCE_EXCERPT.refs[i]}</span>
                                <h3 className={styles.noteTitle}>{point.title}</h3>
                                <p className={styles.noteText}>{point.text}</p>
                            </li>
                        ))}
                        <li className={styles.links} {...reveal(6)}>
                            <a href="https://schema.org/" target="_blank" rel="noopener noreferrer">
                                {t("links.schema")}
                            </a>
                            <a
                                href="https://developers.google.com/search/docs/appearance/structured-data"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("links.googleStructuredData")}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default MetaProof;
