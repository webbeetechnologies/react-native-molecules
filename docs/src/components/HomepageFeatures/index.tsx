import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './styles.module.css';

const FeatureList = [
    {
        title: 'Material 3 Design',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>
                Built with the latest Material Design 3 guidelines. Every component comes with
                production-ready tokens, sensible defaults, and dark mode support out of the box.
            </>
        ),
    },
    {
        title: 'Cross-Platform',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                Write once, run everywhere. Components are optimized for iOS, Android, and Web,
                ensuring a consistent look and feel across all platforms.
            </>
        ),
    },
    {
        title: 'High Performance',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                Powered by <code>react-native-unistyles</code> for blazing fast styles. On the web,
                it leverages CSS variables for efficient theming and minimal runtime overhead.
            </>
        ),
    },
];

function Feature({
    Svg,
    title,
    description,
}: {
    Svg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: React.ReactNode;
}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
