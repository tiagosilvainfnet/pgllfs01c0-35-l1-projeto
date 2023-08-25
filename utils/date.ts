const getLast12Months = () => {
    const currentDate = new Date();
    const months: String[] = [];
    const monthToBase: any[] = [];

    for(let i = 0 ; i < 12; i++){
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() - i;

        if(month < 0){
            year -= 1;
            month += 12;
        }

        months.push(`${(month + 1).toString().padStart(2, '0')}/${year}`);
        monthToBase.push([year.toString(), `${(month + 1).toString().padStart(2, '0')}`]);
    }

    return [
        months.reverse(),
        monthToBase.reverse(),
    ];
}


export { getLast12Months }