import { FC } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const LanguageSwitcher: FC = (): JSX.Element => {
  const { t } = useTranslation();

  const changeLanguage = (locale: string) => {
    i18next.changeLanguage(locale);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("fr")}>French</button>
      <button onClick={() => changeLanguage("es")}>Spanish</button>
    </div>
  );
};

export default LanguageSwitcher;
