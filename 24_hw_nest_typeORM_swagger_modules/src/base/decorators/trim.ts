import { Transform, TransformFnParams } from 'class-transformer';

// Custom decorator (в библиотеке class-transformer по умолчанию нету декоратора trim)
// не забываем установить transform: true в глобальном ValidationPipe
// export const Trim = () =>
//   Transform(({ value }: TransformFnParams) => value?.trim());

export const Trim = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
