// @ts-nocheck
import React from "react";
import { PlannedDailyMealDM } from "../../../../api_client/types.gen";
import dayjs from "dayjs";
import { updatePlannedDailyMeal } from "../../../../api_client";
import { Button, Checkbox, MenuItem, Select, Stack } from "@mui/material";

type EditPlannedMealDayProps = {
    planned_day_meal: PlannedDailyMealDM
  };
  
  
  const EditPlannedMealDay: React.FC<EditPlannedMealDayProps> = (props) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [timeIntervalStart, setTimeIntervalStart] = React.useState<string>(props.planned_day_meal.time_from);
    const [timeIntervalEnd, setTimeIntervalEnd] = React.useState<string>(props.planned_day_meal.time_to);
  
    const [initialExcludedDates, setInitialExcludedDates] = React.useState(props.planned_day_meal.exclusions?.map((date)=>new DateObject(date)));
    const [isAllowed, setIsAllowed] = React.useState<boolean>(props.planned_day_meal.allowed);
    const [mealTimeAlias, setMealTimeAlias] = React.useState<string>(props.planned_day_meal.alias);
    
    const datesPickerRef = React.useRef<any>();
    
    let intervalStartSplitted = timeIntervalStart.split(":").map(el => parseInt(el))
    const timeStartDayjs = dayjs().hour(intervalStartSplitted[0]).minute(intervalStartSplitted[1])
  
    let intervalEndSplitted = timeIntervalEnd.split(":").map(el => parseInt(el))
    const timeEndDayjs = dayjs().hour(intervalEndSplitted[0]).minute(intervalEndSplitted[1]);
  
    const updatePlannedMealDay = async () => {
      // TODO: отправка данных на обновление
      // TODO: исправить operation_id, добавить слово update
      let payload = {
        alias: mealTimeAlias,
        allowed: isAllowed,
        time_from: dayjs(timeIntervalStart).format("HH:mm"),
        time_to: dayjs(timeIntervalEnd).format("HH:mm"),
      };
      // TODO: место с косяками
      if (datesPickerRef.current) {
        payload = {...payload, exclusions: datesPickerRef.current.getSelectedDates()}
      }
      const response = await updatePlannedDailyMeal({
        query: {pk: props.planned_day_meal.id},
        body: {...payload}})
      // console.log(response)
    }
  
    return (
      <>
        {isEditing ? (
          <div style={{ marginLeft: "20px", width: 250}}>  
            <br/>
            <Stack direction={"column"} spacing={1}>
              <Select
                size='small'
                value={mealTimeAlias}
                label="MealTimeAlias"
                onChange={(e) => setMealTimeAlias(e.target.value)}>
                {mealTimeAliases.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <Stack direction={"row"}>
                <b>разрешено ли питание</b>
                <Checkbox checked={isAllowed} onChange={()=>setIsAllowed(!isAllowed)}/>
              </Stack>
              <b>интервал</b>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ru"}>
                <Stack direction={"row"} spacing={1}>
                  <TimePicker
                    label="Начало приёма пищи"
                    value={timeStartDayjs}
                    onChange={(newTime)=>setTimeIntervalStart(String(newTime))}
                    renderInput={(params) => <TextField {...params} />}/>
                  <TimePicker
                    label="Конец приёма пищи"
                    value={timeEndDayjs}
                    onChange={(newTime)=>setTimeIntervalEnd(String(newTime))}
                    renderInput={(params) => <TextField {...params} />}/>
                </Stack>
              </LocalizationProvider>
              <b>даты-исключения</b>
              <MultiDateRangePicker ref={datesPickerRef} selectedDates={initialExcludedDates} />
              <Stack direction={"row"}>
                <Button onClick={updatePlannedMealDay}>сохранить</Button>
                <Button onClick={()=>setIsEditing(false)}>отменить</Button>
              </Stack>
            </Stack>
          </div>
        ) : (
          <Stack direction={"row"}>
            <b style={{ color: props.planned_day_meal.allowed ? "green" : "red" }}>
              {props.planned_day_meal.alias}
            </b>
            <Button size='small' onClick={()=>setIsEditing(true)}>редактировать</Button>
            <Button size='small' onClick={()=>console.log('реализовать удаление')}>удалить</Button>
          </Stack>
        )}
      </>
    );
  }
  
  type MealPlanProps = {
    plan: MealPlanDM
  }
  
  
  const MealPlan: React.FC<MealPlanProps> = (props) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [startDate, setStartDate] = React.useState<string>(props.plan.period_start);
    const [endDate, setEndDate] = React.useState<string>(props.plan.period_end);
    const [menu, setMenu] = React.useState<string>(props.plan.menu.menu_name);
    const [allowedOnThisInterval, setAllowedOnThisInterval] = React.useState<boolean>(props.plan.allowed_on_this_interval);
  
    const saveChanged = async () => {
      setIsEditing(false);
      await updateMealPlan({
        query: {pk: props.plan.id},
        body: {
          allowed_on_this_interval: allowedOnThisInterval,
          period_start: dayjs(startDate).format("YYYY-MM-DD"),
          period_end: dayjs(endDate).format("YYYY-MM-DD"),
          menu: menu
        }
      })
    };
  
    return (
      <>
        {isEditing?(
          <Card sx={{ maxWidth: 500 }}>
          <CardContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction={"row"} spacing={1}>
              <b>Начало периода</b>
              <DatePicker
                      label="Начальная дата"
                      value={dayjs(startDate)}
                      onChange={(newValue) => setStartDate(String(newValue))}
                      />
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <b>Конец периода</b>
              <DatePicker
                      label="Конечная дата"
                      value={dayjs(endDate)}
                      onChange={(newValue) => setEndDate(String(newValue))}
                      />
            </Stack>
  
            </LocalizationProvider>
            <div style={{paddingLeft: 20}}>
              <br/>
              {/* Меню питания: {props.plan.menu.menu_name} */}
              <div>
                <Select label="Меню питания"
                        value={menu}
                        onChange={(e)=>setMenu(e.target.value)}>
                  {menuValues.map((value)=><MenuItem value={value}>{value}</MenuItem>)}
                </Select>
                <Stack direction={"row"}>
                  <b>разрешено ли питание на этом интервале</b>
                  <Checkbox checked={allowedOnThisInterval} onChange={()=>setAllowedOnThisInterval(!allowedOnThisInterval)}/>
                </Stack>
              </div>
              <br/>
            </div>
            <Stack direction="row">
              <Button onClick={saveChanged}>Сохранить</Button>
              <Button onClick={()=>setIsEditing(false)}>Отменить</Button>
            </Stack>
          </CardContent>
        </Card>
        ):(
          <Card sx={{ maxWidth: 500 }}>
          <CardContent>
            <Stack direction={"row"} spacing={1}>
              <b>Начало периода</b>
              <b style={{color: props.plan.allowed_on_this_interval?"green":"red"}}>{props.plan.period_start}</b>
              <div style={{position: "relative", right: 0, top: 0}} onClick={()=>setIsEditing(true)}>редактировать</div>
  
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <b>Конец периода</b>
              <b style={{color: props.plan.allowed_on_this_interval?"green":"red"}}>{props.plan.period_end}</b>
            </Stack>
            <div style={{paddingLeft: 20}}>
              <br/>
              <div>
                Меню питания: {props.plan.menu.menu_name}
              </div>
              <br/>
              <b>Плановые ежедневные приёмы пищи на этот период</b>
              <Stack direction={"column"}>
                {props.plan.planned_day_meals.map((planned_day_meal)=><EditPlannedMealDay planned_day_meal={planned_day_meal}/>
                )}
              </Stack>
            </div>
          </CardContent>
        </Card>)}
      </>
    );
  }