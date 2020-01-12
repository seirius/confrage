import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Env {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        unique: true,
        length: 255,
    })
    public name: string;

}