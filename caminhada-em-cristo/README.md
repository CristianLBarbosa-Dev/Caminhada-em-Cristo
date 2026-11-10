# Caminhada em Cristo — guia rápido

Este pacote contém o site (PWA) e o painel administrativo.

## Arquivos

- `index.html` — o site (orações, terço, rosário, Bíblia, liturgia diária, santo do dia, pedido de oração).
- `admin.html` — painel administrativo (**não aparece no menu do site** — acesse digitando `/admin.html` no navegador).
- `manifest.json`, `sw.js`, `icons/` — arquivos do PWA (instalação e uso offline).
- `firebase-config.js` — onde você cola as chaves do seu projeto Firebase gratuito.
- `firestore.rules` — regras de segurança para colar no Firebase.
- `bible-ave-maria.json` — não é mais usado pelo site (a Bíblia já vem embutida no `index.html`); pode manter como referência ou apagar.

## Passo a passo — configurar o Painel Administrativo (uma única vez)

O painel e o Pedido de Oração precisam de um lugar gratuito para guardar os
dados e permitir login. Usamos o **Firebase** (Google), que é gratuito no
plano "Spark" — não pede cartão de crédito e cobre com folga o uso de um
site como este.

1. Acesse **console.firebase.google.com** e crie um projeto novo (qualquer nome).
2. No menu do projeto: **Compilação → Authentication → Vamos começar** → ative o provedor **E-mail/senha**.
3. No menu do projeto: **Compilação → Firestore Database → Criar banco de dados** → escolha o **modo produção** e a região mais próxima (ex.: `southamerica-east1`).
4. Ainda no Firestore, vá em **Regras**, apague o conteúdo e cole o conteúdo do arquivo `firestore.rules` deste pacote. Clique em **Publicar**.
5. Volte em **Configurações do projeto** (ícone de engrenagem) → role até **Seus aplicativos** → clique no ícone **`</>`** (Web) → registre um app (qualquer apelido) → copie o objeto `firebaseConfig` que aparece.
6. Abra o arquivo `firebase-config.js` deste pacote e cole os valores copiados no lugar dos textos de exemplo (`COLE_AQUI_SUA_API_KEY`, etc.).
7. **Importante — antes de publicar o site:** ainda no Firestore, aba **Dados**, crie manualmente uma coleção chamada `config`, com um documento de ID `setup` contendo um campo `chave` (texto) com uma senha secreta inventada por você (ex.: `pedra-angular-2026-xyz`). Guarde essa chave — você vai digitá-la uma única vez, no primeiro acesso ao painel. **Esse passo impede que outra pessoa crie a conta de administrador antes de você**, caso descubra o endereço `/admin.html` primeiro.
8. Publique/hospede os arquivos (todos na mesma pasta, incluindo `admin.html` e `firebase-config.js`).

## Primeiro acesso ao painel

1. Acesse `seusite.com/admin.html`.
2. Como ainda não existe nenhum administrador, o painel vai pedir um **e-mail real** para a conta de Administrador Principal, outro para a conta de Leitor, e a **chave de configuração** que você cadastrou no passo 7 acima.
3. As senhas iniciais já vêm prontas: **administrador / caminhadacomcristo** e **leitor / leituracomcristo**. Recomendo trocar assim que entrar, em **Configurações → Enviar redefinição de senha**.

## Se a página do painel continuar dizendo "não configurado"

Depois de editar o `firebase-config.js`, se a mensagem de "painel ainda não
configurado" continuar aparecendo mesmo com tudo certo, o motivo mais comum
é o **Service Worker guardando em cache a versão antiga** desse arquivo
(ele existe para o site funcionar offline, mas isso pode atrasar a
atualização de um arquivo que você acabou de editar). Para resolver:

1. Abra as ferramentas do desenvolvedor do navegador (tecla **F12**).
2. Vá na aba **Application** (ou **Aplicativo**) → **Service Workers**.
3. Clique em **Unregister** (ou **Cancelar registro**).
4. Recarregue a página com **Ctrl+Shift+R** (ou **Cmd+Shift+R** no Mac).

Isso só costuma ser necessário uma vez, logo depois de trocar o
`firebase-config.js` publicado. A mensagem de erro na tela do painel agora
também mostra o motivo exato (arquivo não encontrado, chave de exemplo
ainda não trocada, SDK não carregou, etc.) para facilitar o diagnóstico.

## Sobre as senhas

O painel usa o sistema de autenticação do próprio Firebase — as senhas
nunca ficam salvas em texto puro nem em nosso código: o Firebase já cuida
de guardá-las com hash de forma segura. A troca de senha é feita por link
enviado ao e-mail cadastrado de cada conta.

## Níveis de acesso

- **Administrador Principal**: vê e responde pedidos de oração, muda a situação (Pendente / Em oração / Concluído), **exclui** pedidos, e gerencia usuários (envia redefinição de senha).
- **Leitor**: vê os pedidos de oração e também pode mudar a situação (Pendente / Em oração / Concluído) — mas não pode excluir pedidos nem gerenciar usuários.

## O que ainda falta (próximas etapas, fora do combinado até aqui)

- Edição do conteúdo de Orações, Liturgia e Santos diretamente pelo painel (hoje esses conteúdos vêm prontos no site).

## Publicando na Vercel (plano gratuito)

Não tem conflito — um site assim (HTML/CSS/JS puro, sem servidor) é exatamente
o que a Vercel hospeda de graça. Só fique de olho nestes pontos:

1. **Ao criar o projeto na Vercel:** escolha **Framework Preset: Other**, deixe
   o **Build Command** vazio e o **Output Directory** como raiz (`.`). Não é um
   projeto Next.js/React, não precisa de build.
2. **Suba todos os arquivos no mesmo nível** (a raiz do projeto): `index.html`,
   `admin.html`, `manifest.json`, `sw.js`, `firebase-config.js`, a pasta
   `icons/`, etc. Os caminhos no código são relativos (`./manifest.json`,
   `./icons/...`), então a estrutura de pastas precisa ficar igual à deste pacote.
3. **HTTPS é automático na Vercel** — ótimo, porque o Service Worker (parte do
   PWA) só funciona em HTTPS.
4. **Firebase → Authentication → Settings → Authorized domains:** adicione o
   domínio que a Vercel te der (ex.: `seusite.vercel.app`) e, se depois
   configurar um domínio próprio, adicione ele também. Não é sempre
   obrigatório para login por e-mail/senha, mas evita qualquer erro de
   "domínio não autorizado" caso você ative outro método de login no futuro.
5. Incluí um `vercel.json` neste pacote que impede a CDN da Vercel de guardar
   `sw.js` e `firebase-config.js` em cache por muito tempo — mesma lógica da
   correção que fizemos no Service Worker, só que agora também no lado do
   servidor. Sem isso, uma edição no `firebase-config.js` poderia demorar para
   aparecer para os visitantes.
