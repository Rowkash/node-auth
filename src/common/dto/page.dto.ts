import { z as zod } from 'zod';

export enum OrderSortEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export const PageDtoSchema = zod.object({
  page: zod.coerce.number('Page field should be number').min(1).default(1),
  limit: zod.coerce
    .number('Limit field should be number')
    .min(1)
    .max(500)
    .default(10),
  orderSort: zod.enum(OrderSortEnum).default(OrderSortEnum.ASC),
});
