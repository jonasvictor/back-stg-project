import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import Usuario from "./Usuario";

@Entity('transacao')
class Transacao {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  usuario_id: number;

  @Column('int')
  tipo_id: number;

  @Column('int')
  status_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column('timestamp')
  data: Date;

  // Relação muitos-para-um com a entidade Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.transacoes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
  
}

export default Transacao;
