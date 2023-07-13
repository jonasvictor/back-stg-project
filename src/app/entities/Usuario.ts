import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import bcrypt from 'bcryptjs';

@Entity('usuario')
class Usuario {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', {length: 100})
    name: string;

    @Column('varchar', {length: 255})
    email: string;

    @Column('varchar', {length: 255})
    senha: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashSenha() {
        this.senha = bcrypt.hashSync(this.senha, 8);
    }

}

export default Usuario;