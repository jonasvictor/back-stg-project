import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('status_transacao')
export class StatusTransacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nome: string;
}
