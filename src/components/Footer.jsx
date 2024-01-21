export default function Footer() {
  return (
    <footer className="mx-auto my-4 w-full max-w-7xl px-8 py-4 text-center text-[0.8rem] text-text-secondary dark:text-d-text-secondary">
      <span>
        &copy; {new Date().getFullYear()} Autor: Patryk Graj
        <br />
        Powered by{" "}
        <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">
          Vite
        </a>
        .
      </span>
    </footer>
  )
}
