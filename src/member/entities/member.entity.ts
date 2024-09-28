import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "members"})
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable: false})
    userid: string;

    @Column({nullable: false})
    password: string;

    @Column({unique: false, nullable: false})
    useremail: string;
}
