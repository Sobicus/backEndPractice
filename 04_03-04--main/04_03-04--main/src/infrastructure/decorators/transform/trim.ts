/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transform, TransformFnParams } from 'class-transformer';

// Custom decorator (в библиотеке class-transformer по умолчанию нету декоратора trim)
// не забываем установить transform: true в глобальном ValidationPipe
export const Trim = (): any => Transform(({ value }: TransformFnParams) => value?.trim());
