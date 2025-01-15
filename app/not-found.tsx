import Link from 'next/link';
import css from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={css.notFound__wrapper}>
            <div className={css.notFound__container}>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>We couldn't find the page you were looking for. This is either because:</p>
                <ul>
                    <li>There is an error in the URL entered into your web browser. Please check the URL and try again.</li>
                    <li>The page you are looking for has been moved or deleted.</li>
                </ul>
                <Link href="/" className={css.homeLink}>
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}
