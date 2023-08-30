import { Task } from "../models/task.entity";
import { getLast12Months } from "../utils/date";
import { Op } from "sequelize";
import { sequelize } from "../db";
import moment from "moment";
require('moment/locale/pt-br');
moment.locale('pt-br');

export default class TaskController{
    async getData(){
        const monts = getLast12Months();
        const labels = monts[0];
        const data = await this.getTotalByMonth2(monts[1])

        return  {
            labels: labels,
            data: {
                labels,
                datasets: [
                  {
                    label: 'Tarefas Feitas',
                    data: data[0],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                  {
                    label: 'Tarefas em aberto',
                    data: data[1],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  },
                ],
            }
        }
    }

    async getWeekDays(){
        const hoje = moment()

        var diasDaSemana: any = [];
        var data_active: any = [];
        var data_inactive: any = [];

        for(let i = 0; i < 7; i++){
            const date = moment(hoje).subtract(i, 'days');
            const dayWeek = date.format('dddd');
            diasDaSemana.push(dayWeek);

            const r_active = await this.getTotalDay(date.format('YYYY-MM-DD'), 1)
            const r_inactive = await this.getTotalDay(date.format('YYYY-MM-DD'), 0)
            data_active.push(r_active)
            data_inactive.push(r_inactive)
        }

        data_active.reverse()
        data_inactive.reverse()
        diasDaSemana.reverse()

        return [diasDaSemana, data_active, data_inactive];
    }

    async getTotalDay(day: string, status: any){
        return await Task.count({
            where: {
                createdAt: {
                    [Op.and]: [
                        sequelize.literal(`createdAt >= '${day} 00:00:00'`),
                        sequelize.literal(`createdAt <= '${day} 23:59:59'`),
                    ]
                },
                status: status
            }
        });
    }

    async getDataMonth(month: any){
        const result = await this.getWeekDays();
        console.log(result)

        return  {
            labels: result[0],
            data: {
                labels: result[0],
                datasets: [
                  {
                    label: 'Tarefas Feitas',
                    data: result[1],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                  {
                    label: 'Tarefas em aberto',
                    data: result[2],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  },
                ],
            }
        }
    }

    async getTotalByMonth(months: any[], status: any){
        const tasks: Number[] = []

        for(const month of months){
            const _tasks = await Task.count({
                where: {
                    createdAt: {
                        [Op.and]: [
                            sequelize.literal(`MONTH(createdAt) = ${month[1]}`),
                            sequelize.literal(`YEAR(createdAt) = ${month[0]}`),
                        ]
                    }
                }
            });

            tasks.push(_tasks);
        }
        return tasks;
    }

    async getTotalByMonth2(months: any[]){
        const tasksTrue: any[] = []
        const tasksFalse: any[] = []

        for(const month of months){
            const _tasks = await Task.findAll({
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalTasks']
                ],
                where: {
                    createdAt: {
                        [Op.and]: [
                            sequelize.literal(`MONTH(createdAt) = ${month[1]}`),
                            sequelize.literal(`YEAR(createdAt) = ${month[0]}`),
                        ]
                    }
                },
                group: ['status']
            })

            const t = _tasks.map((t: any) => {
                return {
                    status: t.status,
                    totalTasks: t.get('totalTasks')
                }
            });
            if(t[0]){
                tasksTrue.push(t[0]['totalTasks']);
            }else{
                tasksTrue.push(0);
            }
            if(t[1]){
                tasksFalse.push(t[1]['totalTasks']);
            }else{
                tasksFalse.push(0);
            }
        }

        return [tasksTrue, tasksFalse];
    }
}
