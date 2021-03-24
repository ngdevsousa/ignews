import styles from "./styles.module.scss"

export function Header(){

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ign.news"/>
        <nav>
          <a href="" className={styles.active}>Home</a>
          <a href="">Posts</a>
        </nav>
      </div>
    </header>
  )
}