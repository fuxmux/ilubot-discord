import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Drama {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel: string;

  @Column()
  authorUsername: string;

  @Column()
  authorId: string;

  @Column()
  reason: string;

  @CreateDateColumn({ name: "createdAt", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp with time zone" })
  updatedAt: Date;
}
