import headerButton from '../HeaderTab.module.css'
type PropsType = {
    title : string,
    isActive : boolean,
    onClick : () => void
}

const HeaderTab = (props : PropsType) => {
    return (
        <section className={props.isActive ? headerButton.selectedTab : headerButton.headerButton}
                onClick={() => {
                    props.onClick()
                }}>
            <p className={headerButton.title}>
                {props.title}
            </p>
        </section>
    );
};

export default HeaderTab;