import { NextApiRequest, NextApiResponse } from 'next'
import FileUploadService from '../../lib/upload.service';
import { APIResponse } from '../../models/api-response';
import SelectiveProcessService from '../../lib/selectiveprocess.service';
import { SelectiveProcess } from '../../models/selective-process';


async function endpoint(req: NextApiRequest, res: NextApiResponse) {

  const selectiveProcessService = SelectiveProcessService();

  switch (req.method) {

    case "POST":
      try {
        // await multerAny(req, res);

        let response: APIResponse = {
          msg: "Processo seletivo salvo com sucesso!",
          result: null
        }
        const body = await req.body;

        if (!body.id) {
          //New Process

          const { title, creationDate, state }: SelectiveProcess = body

          const newProcess: SelectiveProcess = {
            title: title,
            creationDate: creationDate,
            state: state,
            numberPlaces: 0,
            reservedPlaces: [
              { name: "Servidores do IFBA", numberPlaces: 0 },
              { name: "Pessoas com Deficiência", numberPlaces: 0 },
              { name: "Negros (Pretos e Pardos) ", numberPlaces: 0 },
              { name: "Indígenas", numberPlaces: 0 },
              { name: "Quilombolas", numberPlaces: 0 },
              { name: "Pessoas Trans (Transexuais, Transgêneros e Travestis)", numberPlaces: 0 },
            ]
          }

          await selectiveProcessService.save(newProcess);

          response.result = newProcess;
        } else {
          await selectiveProcessService.update(body);
          response.result = body;
        }

        res.status(200).json(response);
      } catch (e) {
        console.log(e);
        return res.json({ error: "error" });
      }

      break;

    case "GET":

      let getResponse: APIResponse = {
        msg: "",
        result: null
      };

      if (req.query.inconstruction == "true") {
        const process = await selectiveProcessService.getInConstruction();
        getResponse.result = process;
      } else if (req.query.open == "true") {
        const process = await selectiveProcessService.getOpen();
        getResponse.result = process;
      } else {
        // const newsList = req.query.page ? await selectiveProcessService.getPage(+req.query.page.toString()) : await selectiveProcessService.getAll();
        // getResponse.result = newsList;
      }

      res.status(200).json(getResponse);
      break

    case "DELETE":
      let newsID = req.query.id.toString();
      const deletedNews = await selectiveProcessService.getById(newsID);
      let uploadService = FileUploadService();
      // await uploadService.remove(deletedNews.coverURL);

      // await selectiveProcessService.remove(newsID);

      let deleteResponse: APIResponse = {
        msg: "Notícia removida com sucesso!",
        result: {}
      }

      res.status(200).json(deleteResponse);
      break;

    default:
      console.log(req.method)
      res.status(405);
      break;
  }

}


export const config = {
  api: {
    bodyParser: true,
  },
}

export default endpoint;
