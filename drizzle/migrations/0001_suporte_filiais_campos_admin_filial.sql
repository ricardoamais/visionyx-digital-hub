ALTER TYPE public.suporte_perfil ADD VALUE IF NOT EXISTS 'admin_filial';
ALTER TABLE public.suporte_filiais
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS numero text,
  ADD COLUMN IF NOT EXISTS bairro text,
  ADD COLUMN IF NOT EXISTS cep text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS responsavel text;
CREATE UNIQUE INDEX IF NOT EXISTS suporte_filiais_cnpj_uniq ON public.suporte_filiais (cnpj) WHERE cnpj IS NOT NULL AND cnpj <> '';