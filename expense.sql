use pikinav;

create table registration(
name varchar(40),
password varchar(40),
email varchar(40)
);

alter table registration
add column password char(60) binary;



create table expense
(
eid int not null auto_increment primary key,
name varchar(20),
credit numeric,
debit numeric,
balance  numeric,
expense_date date
);

drop table expense;

use pikinav;

select * from expense;

alter table expense
add column user_id int;

select * from users;
show tables;
describe users;

update expense set user_id=1 where eid=1;

select e.eid,e.name from expense e inner join users u on u.uid=e.user_id;

alter table registration
rename to users;

alter table users
add  uid int not null auto_increment primary key;


describe users;
describe expense;
select * from expense;
alter table expense
add FOREIGN KEY (user_id) references users(uid);

alter table expense
add constraint user_id
foreign key(uid) references users(uid);