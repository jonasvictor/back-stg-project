import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import bcrypt from 'bcryptjs';
import Transacao from "./Transacao";

@Entity('usuario')
class Usuario {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 100 })
    name: string;

    @Column({type: 'varchar', length: 255 , unique: true})
    email: string;

    @Column('varchar', { length: 255 })
    senha: string;

    // Relação um-para-muitos com a entidade Transacao
    @OneToMany(() => Transacao, (transacao) => transacao.usuario)
    transacoes: Transacao[];

    @BeforeInsert()
    @BeforeUpdate()
    hashSenha() {
        this.senha = bcrypt.hashSync(this.senha, 8);
    }

}

export default Usuario;

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