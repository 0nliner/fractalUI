// @ts-nocheck
import React from "react";
import { getCapcha } from "../../../../api_client";
import { TextField } from "@mui/material";
import { WidgetProps } from "@rjsf/utils";


const CapchaField = (props: WidgetProps) => {
    const { formData = {}, onChange } = props;

    const [capchaRawSVG, setCapchaRawSVG] = React.useState('');
    const [capchaToken, setCapchaToken] = React.useState('');
    const [capchaSolved, setCapchaSolved] = React.useState('');

    React.useEffect(() => {
        const getCapcha_ = async () => {
          const capchaResp = await getCapcha()
          setCapchaRawSVG(capchaResp.data.capcha_svg);
          setCapchaToken(capchaResp.data.capcha_token);
          
          const capchaEl = document.getElementById("capchaPlaceholder");
          if (capchaEl) {
            capchaEl.innerHTML = capchaResp.capcha_svg
          }
        }
        getCapcha_()
      }, [])

    const handleChange = (value: string) => {
        setCapchaSolved(value);
        props.onChange({...formData,
            // capcha_solve: Number.parseInt(value),
            capcha_solve: value,
            capcha_token: capchaToken,
            unpack: true
        })
    }

    return (
        <div {...props} style={{display: "flex", flexDirection: "column", gap: 10}}>
            <div id="capchaPlaceholder" style={{
                background: "white",
                borderRadius: 15,
                marginLeft: "auto", 
                marginRight: "auto" }} dangerouslySetInnerHTML={{__html: capchaRawSVG}}/>
            <TextField
                sx={{width: "100%"}}
                // sx={fieldStyle}
                onChange={(e) => {handleChange(e.target.value)}}/>
        </div>
    )
}


export const LoginFormSettings = {
    UISchema: {
    "ui:title": "Вход в систему",
    "login": {
        "ui:title": "Логин",
        "ui:placeholder": "Введите логин",
    },
    "password": {
        "ui:title": "Пароль",
        "ui:widget": "password",
        "ui:help": "Введите пароль",
    },
    "capcha_solve": {
        "ui:title": "Капча",
        "ui:field": "CapchaField",
        "ui:placeholder": "Введите капчу",
    },
    "capcha_token": {
        "ui:widget": "hidden",
        "noValidate": true,
        "ui:title": "поле, которое надо скрыть из формы",
    },
    "ui:submitButtonOptions": {
        "submitText": "войти"
      }
    },
    operationId: "login",
    fields: {CapchaField},
    overrides: {
        "dropItem required": ["capcha_token", "capcha_solve"],
        "properties.capcha_solve.type": "object",
    },
    // string
    onSubmit: (formData: Record<string, any>) => {
        let payload: Record<string, any> = {};
      
        Object.entries(formData).forEach(([key, value]) => {
          // Проверяем, что value — это объект, не null и содержит свойство unpack
          if (
            typeof value === "object" &&
            value !== null &&
            "unpack" in value
          ) {
            // «Распаковываем» объект, убирая из него поле unpack
            const { unpack, ...rest } = value;
            // Добавляем к итоговому объекту оставшиеся поля
            payload = { ...payload, ...rest };
          } else {
            // Иначе просто копируем свойство
            payload[key] = value;
          }
        });
      
        return payload;
      }
}


