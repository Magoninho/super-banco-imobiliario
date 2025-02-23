# Criar sala
1. usuario clica em criar sala
2. usuario preenche os dados da sala
3. usuario clica no botao de criar sala
    1. Requisicao enviada para a rota `/api/room/create` na api
    2. na api eh gerado um JWT assim como a sala eh criada no banco de dados junto com um PIN para ela
    3. a api retorna o token e o PIN (roomCode)
    4. a api tambem cria um jogador inicial com um nome aleatorio na sala que vai ser marcado como admin
        **o id desse jogador inicial eh passado como informacao extra no token jwt**
4. usuario eh redirecionado para a pagina da room que eh uma rota protegida no react router (`/room/<codigo>`)
5. no useEffect eh enviado um POST com o token jwt para uma rota `/api/verify-token`, a fim de verificar se o usuario pode acessar
    (parece redundante, mas caso o usuario atualize a pagina sem querer ele teria que reenviar o token de qualquer forma)
6. se o usuario poder acessar, a pagina carrega e o popup de definir nickname aparece, se nao, ele eh enviado de volta para a pagina de entrar na sala
    1. ao mesmo tempo eh enviado uma mensagem do socket para entrar na room usando socket.join();
    2. o socket tambem sera responsavel por enviar uma mensagem informando a entrada do jogador, que podera ser convertido num pop up para todos os outros jogadores
    3. toda vez que o usuario entrar, um novo socket_id é gerado, este deve ser armazenado na coluna do banco de dados de cada jogador
7. usuario insere o nickname, e ao clicar no botao, eh enviado uma requisição para a api na rota `/api/set-nickname`, onde vai ser passado o token (que possui o playerId correspondente)
    1. o token eh verificado, se for valido, o nickname eh trocado na coluna do player no banco de dados
    2. provavelmente vai ser necessario enviar uma mensagem ao socket informando a troca de nickname, para que o nome mude para todos os outros users
    3. o valor da coluna `has_set_nickname` na tabela de players também será trocada para `true`
8. o pop up some e o react atualiza onde for necessario

## Troubleshooting
Caso o usuário atualize a pagina sem querer
1. no useEffect vai ser feita uma requisição para `/api/verify-token` para verificar se o token que esta no localstorage é valido, mas isso já estava sendo feito antes
2. se for valido, o playerId que está dentro do token vai ser utilizado para verificar se a coluna `has_set_nickname` no banco de dados esta como `true`
3. nesse caso vai estar como `true`, então, podemos pular o dialogo de setar nickname
4. além disso, é necessário atualizar o socket_id no banco de dados???

# Entrar na sala
1. usuario clica em entrar na sala 
2. usuario preenche os dados da sala (pin e senha)
3. se já haver um token no localstorage
4. se não, é criado um novo token e o usuario entra na sala
'

# fluxo da gameplay (com socket.io)
## Botao receber/gastar
1. usuario clica no botao de receber
2. popup aparece com um formulario perguntando a quantia de dinheiro
3. usuario informa a quantia de dinheiro e clica em ok
    1. ao clicar em ok eh enviado uma mensagem pelo socket que precisa chegar apenas para o admin
        1. para enviar a mensagem apenas para o admin é necessário que o servidor faça uma consulta no banco para pesquisar qual usuario está marcado como admin e capturar o socket_id dele
        2. assim o socket pode enviar a mensagem para esse id específico
    2. na mensagem existem os dados da acao, como a quantia que vai ser recebida ou gasta, e se a acao eh de receber ou gastar
4. o admin recebe a mensagem do socket e eh mostrado um pop up na tela dele perguntando se ele deve permitir a ação
5. admin recebe a mensagem de permissão
6. admin clica em permitir
    1. são feitas queries para diminuir ou somar dinheiro na quantia do player no banco de dados
    2. uma mensagem é enviada de volta ao jogador via socket para atualizar as informações no frontend

## Botão transferir
TODO