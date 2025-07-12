import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import GraficoFinanceiro from '../components/GraficoFinanceiro';
import { useState } from 'react';

const Dashboard = () => {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [filtro, setFiltro] = useState({ dataInicio: '', dataFim: '' });

    const [kpis, setKpis] = useState<{ total_receita: string; total_despesas: string; lucro_bruto: string } | null>(null);

    const aplicarFiltro = () => {
        setKpis(null); // Limpa KPIs enquanto carrega novos
        setFiltro({ dataInicio, dataFim });
    };

    return (
        <div className="bg-light min-vh-100 flex-column align-items-center">
            <div className="dashboard-bg py-5">
                <Container>
                    <h2 className="mb-4 text-center dashboard-title">Painel Financeiro</h2>

                    {/* Filtros */}
                    <Form className="mb-4">
                        <Row className="align-items-end justify-content-center">
                            <Col md={4}>
                                <Form.Group controlId="dataInicio">
                                    <Form.Label>Data Início</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="dataFim">
                                    <Form.Label>Data Fim</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="auto">
                                <Button variant="success" onClick={aplicarFiltro}>
                                    Filtrar
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    {/* KPIs Cards */}
                    {kpis && (
                        <Row className="mb-4 text-center">
                            <Col md={6}>
                                <Card className="shadow-sm rounded-4 border-start">
                                    <Card.Body>
                                        <h5 className="text-success">Total de Receita</h5>
                                        <h3>R$ {kpis.total_receita}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="shadow-sm rounded-4 border-start ">
                                    <Card.Body>
                                        <h5 className="text-danger">Total de Despesas</h5>
                                        <h3>R$ {kpis.total_despesas}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* Gráfico */}
                    <Row>
                        <Col>
                            <Card className="shadow rounded-4">
                                <Card.Body>
                                    <GraficoFinanceiro
                                        dataInicio={filtro.dataInicio}
                                        dataFim={filtro.dataFim}
                                        onResumoKpis={setKpis}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};
export default Dashboard;