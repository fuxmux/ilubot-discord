import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel: string;

  @Column()
  quoteeUsername: string;

  @Column({
    nullable: true
  })
  quoteeId: string;

  @Column()
  authorUsername: string;

  @Column({
    nullable: true
  })
  authorId: string;

  @Column()
  content: string;

  @CreateDateColumn({ name: "createdAt", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp with time zone" })
  updatedAt: Date;
}
