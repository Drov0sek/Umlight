import techSupport from '../Styles/TechSupportStyles/TechSupport.module.css'

const TechSupport = () => {
    return (
        <main className={techSupport.techSupport}>
            <p className={techSupport.title}>Наши социальные сети и техническая поддержка</p>
            <p className={techSupport.link}>Наша электронная почта: gvolkofrib@gmail.com</p>
        </main>
    );
};

export default TechSupport;