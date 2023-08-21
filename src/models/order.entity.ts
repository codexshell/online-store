import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as moment from 'moment';

import { Item } from './item.entity';
import { User } from './user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => Item, (item) => item.order, { cascade: ['insert'] })
  items: Item[];

  getId(): number {
    return this.id;
  }

  setId(id: number) {
    this.id = id;
  }

  getTotal() {
    return this.total;
  }

  setTotal(total: number) {
    this.total = total;
  }

  getDate() {
    const date = this.date;
    const formattedDate = moment(date).format('MMMM Do YYYY, h:mm a');
    return formattedDate;
  }

  setDate(date: Date) {
    this.date = date;
  }

  getUser() {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }

  getItems(): Item[] {
    return this.items;
  }

  setItems(items: Item[]) {
    this.items = items;
  }
}
