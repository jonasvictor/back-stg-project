import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, Unique } from "typeorm";
import bcrypt from 'bcryptjs';

@Entity('usuario')
@Unique(['email'])
class Usuario {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('varchar', { length: 255 })
    email: string;

    @Column('varchar', { length: 255 })
    senha: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashSenha() {
        this.senha = bcrypt.hashSync(this.senha, 8);
    }

    // @BeforeInsert()
    // @BeforeUpdate()
    // validateFields() {
    //     if (!this.name) {
    //         throw new Error("O campo 'name' é obrigatório.");
    //     }
    //     if (!this.email) {
    //         throw new Error("O campo 'email' é obrigatório.");
    //     }
    // }
}

export default Usuario;
