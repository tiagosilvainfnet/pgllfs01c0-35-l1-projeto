import { Task } from "../models/task.entity";
import { getLast12Months } from "../utils/date";
import { Op } from "sequelize";
import { sequelize } from "../db";

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
