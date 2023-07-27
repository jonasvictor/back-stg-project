import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_transacao')
export class TipoTransacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nome: string;
}