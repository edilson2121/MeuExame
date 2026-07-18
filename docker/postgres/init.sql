-- MeuExame Database Initialization Script
-- Executado automaticamente na primeira vez que o container PostgreSQL inicia

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_institutions_name ON institutions(name);
CREATE INDEX IF NOT EXISTS idx_subjects_course ON subjects(course_id);
CREATE INDEX IF NOT EXISTS idx_subjects_institution ON subjects(institution_id);
CREATE INDEX IF NOT EXISTS idx_contents_subject ON contents(subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_exam ON results(exam_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Dados iniciais: Planos de Assinatura
INSERT INTO plans (id, name, description, price, duration, type, "isActive", "createdAt", "updatedAt")
VALUES 
    ('plan_daily', 'Diário', 'Acesso por 1 dia', 50.00, 1, 'DAILY', true, NOW(), NOW()),
    ('plan_weekly', 'Semanal', 'Acesso por 7 dias', 250.00, 7, 'WEEKLY', true, NOW(), NOW()),
    ('plan_monthly', 'Mensal', 'Acesso por 30 dias', 800.00, 30, 'MONTHLY', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Dados iniciais: Templates de Layout
INSERT INTO layout_templates (id, name, description, html, css, "isActive", "createdAt", "updatedAt")
VALUES 
    ('layout_default', 'Padrão', 'Layout padrão simples', 
     '<div class="container">{{content}}</div>', 
     '.container { max-width: 1200px; margin: 0 auto; padding: 20px; }', 
     true, NOW(), NOW()),
    ('layout_banner', 'Com Banner', 'Layout com banner no topo',
     '<div class="banner">{{banner}}</div><div class="container">{{content}}</div>',
     '.banner { width: 100%; height: 200px; background: #333; color: white; } .container { max-width: 1200px; margin: 0 auto; padding: 20px; }',
     true, NOW(), NOW()),
    ('layout_sidebar', 'Com Sidebar', 'Layout com menu lateral',
     '<div class="sidebar">{{menu}}</div><div class="main">{{content}}</div>',
     '.sidebar { width: 250px; float: left; } .main { margin-left: 270px; }',
     true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updatedAt automaticamente
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON DATABASE meuexame IS 'MeuExame - Plataforma de Gerenciamento Educacional para Moçambique';
COMMENT ON TABLE users IS 'Utilizadores da plataforma (estudantes, professores, administradores)';
COMMENT ON TABLE institutions IS 'Instituições de ensino (universidades, escolas, liceus)';
COMMENT ON TABLE exams IS 'Exames de admissão e avaliações';
COMMENT ON TABLE subscriptions IS 'Assinaturas dos utilizadores';
COMMENT ON TABLE payments IS 'Transações de pagamento (M-Pesa, Bank, Cash)';
