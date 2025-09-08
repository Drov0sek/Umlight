import {type Dispatch, type SetStateAction} from "react";
import loginField from '../LoginField.module.css'

type InputProps = {
    type: 'text' | 'password' | 'email';
    inputValue: string;
    setInputValue : Dispatch<SetStateAction<string>>
};

type SelectProps = {
    options: string[] | number[];
    type: 'select';
    value: string | number
    setValue : Dispatch<SetStateAction<string | number>>
};

type CommonProps = {
    title: string;
};

type PropsType = CommonProps & (InputProps | SelectProps);

const LoginField = (props : PropsType) => {
    function getInput(){
        if (props.type === 'select') {
            const optionsList = props.options.map((e, i) => <option value={e} key={i}>{e}</option>)
            return <select
                value={props.value}
                onChange={(event) => {
                    const newValue = event.target.value;
                    props.setValue(
                        props.options.some(opt => typeof opt === 'number')
                            ? Number(newValue)
                            : newValue
                    );
                }}
            >
                {optionsList}
            </select>
        } else {
            return <input type={props.type} value={props.inputValue}
                          onChange={event => props.setInputValue(event.target.value)}/>
        }
    }

    return (
        <section className={loginField.fields}>
            <label>{props.title}</label>
            {getInput()}
        </section>
    );
};

export default LoginField;