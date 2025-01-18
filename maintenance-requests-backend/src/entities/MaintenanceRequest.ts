import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class MaintenanceRequest {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ default: "Open" })
  status: "Open" | "In Progress" | "Resolved";

  @Field()
  @Column({ default: "Emergency" })
  urgency: "Non Urgent" | "Less Urgent" | "Urgent" | "Emergency" | "High" | "Low";

  @Field()
  @Column({ default: "" })
  description: string;


  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  resolvedAt: Date;
}
