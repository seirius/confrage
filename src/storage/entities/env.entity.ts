import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Env {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

}