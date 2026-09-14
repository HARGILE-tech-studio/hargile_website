// Conversational replacement for ContactSection: the form reads as a sentence
// you complete. Same react-hook-form wiring and field names as the classic
// version, so the schema, API route, and translations keys keep working.

import {
  ProseBlock,
  ProseLine,
  SlotInput,
  SlotRequiredMark,
  ProseMessage,
  ProseTextArea,
  ProseErrorList,
  ProseCheck,
} from "../quote-request-form.styled";

const FIELD_ORDER = ["name", "object", "email", "phone", "website", "description"];

/* `audit` is the checkbox; when it is on, the site line appears and its slot
   becomes required (schema in contact-form.jsx). Off, the form is a plain
   contact form. */
export function ProseContactSection({ t, register, errors, audit }) {
  const errorMessages = FIELD_ORDER.map((field) => errors[field]?.message).filter(
    Boolean
  );

  return (
    <div>
      <ProseBlock>
        <ProseLine>
          {t("prose.greeting")}{" "}
          <SlotInput
            id="name"
            type="text"
            aria-label={t("contact.name")}
            aria-required="true"
            placeholder={t("prose.namePlaceholder")}
            $minCh={12}
            $hasError={!!errors.name}
            {...register("name")}
          />
          <SlotRequiredMark aria-hidden="true">*</SlotRequiredMark>
        </ProseLine>
        <ProseLine>
          {t("prose.subject")}{" "}
          <SlotInput
            id="object"
            type="text"
            aria-label={t("contact.object")}
            aria-required="true"
            placeholder={t("prose.objectPlaceholder")}
            $minCh={16}
            $hasError={!!errors.object}
            {...register("object")}
          />
          <SlotRequiredMark aria-hidden="true">*</SlotRequiredMark>.
        </ProseLine>
        <ProseCheck htmlFor="audit">
          <input id="audit" type="checkbox" {...register("audit")} />
          {t("prose.audit")}
        </ProseCheck>
        {audit ? (
          <ProseLine style={{ paddingLeft: "1.2em" }}>
            {t("prose.site")}{" "}
            <SlotInput
              id="website"
              type="text"
              inputMode="url"
              autoComplete="url"
              aria-label={t("contact.website")}
              aria-required="true"
              placeholder={t("prose.sitePlaceholder")}
              $minCh={18}
              $hasError={!!errors.website}
              {...register("website")}
            />
            <SlotRequiredMark aria-hidden="true">*</SlotRequiredMark>.
          </ProseLine>
        ) : null}
        <ProseLine>
          {t("prose.reach")}{" "}
          <SlotInput
            id="email"
            type="email"
            aria-label={t("contact.email")}
            aria-required="true"
            placeholder={t("prose.emailPlaceholder")}
            $minCh={18}
            $hasError={!!errors.email}
            {...register("email")}
          />
          <SlotRequiredMark aria-hidden="true">*</SlotRequiredMark>{" "}
          {t("prose.reachOr")}{" "}
          <SlotInput
            id="phone"
            type="tel"
            aria-label={t("contact.phone")}
            placeholder={t("prose.phonePlaceholder")}
            $minCh={12}
            $hasError={!!errors.phone}
            {...register("phone")}
          />{" "}
          ({t("prose.optional")}).
        </ProseLine>
      </ProseBlock>

      <ProseMessage>
        <label htmlFor="description">
          {t("prose.moreLabel")}
          <SlotRequiredMark aria-hidden="true">*</SlotRequiredMark>
        </label>
        <ProseTextArea
          id="description"
          rows={5}
          aria-required="true"
          placeholder={t("prose.messagePlaceholder")}
          $hasError={!!errors.description}
          {...register("description")}
        />
      </ProseMessage>

      {errorMessages.length > 0 && (
        <ProseErrorList role="alert">
          {errorMessages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ProseErrorList>
      )}
    </div>
  );
}
