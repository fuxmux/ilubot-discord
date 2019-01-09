import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  
  @Entity()
  export class Think {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    channel: string;
  
    @Column()
    authorUsername: string;
  
    @Column()
    authorId: string;
  
    @Column()
    url: string;
  
    @CreateDateColumn({ name: "createdAt", type: "timestamp with time zone" })
    createdAt: Date;
  
    @UpdateDateColumn({ name: "updatedAt", type: "timestamp with time zone" })
    updatedAt: Date;
  }
