import { useTranslation } from "next-i18next";
import styles from "./index.module.scss";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (locale: string) => {
     i18n.changeLanguage(locale)
  };

  return (
    <div className={styles.menu}>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("fr")}>French</button>
      <button onClick={() => changeLanguage("es")}>Spanish</button>
    </div>
  );
};

export default LanguageSwitcher;
