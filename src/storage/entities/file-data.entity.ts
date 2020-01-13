import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Env } from "./env.entity";

@Entity()
export class FileData {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(env => Env, env => env.id, {
        cascade: true,
    })
    @JoinColumn()
    public env: Env;

    @Column({
        nullable: false,
        length: 255,
    })
    public path: string;

    @Column({
        nullable: false,
        length: 255,
    })
    public type: string;

    @Column({length: 510, nullable: false})
    public filename: string;

}
