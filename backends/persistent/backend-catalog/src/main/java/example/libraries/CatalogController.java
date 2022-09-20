package example.libraries;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import example.libraries.mysqlservices.IbookService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE })
public class CatalogController {

    @Autowired
    private IbookService service;
    
    public CatalogController() {
    }

    @GetMapping("/getlibros")
    public ResponseEntity<?> GetLibraries() {
        List<Book> booksList = service.GetAll();// new ArrayList<Book>(books.values());
        return new ResponseEntity<List<Book>>(booksList, HttpStatus.OK);
    }

    @PostMapping("/agregarlibro")
    public ResponseEntity<?> PostLibrary(@RequestParam(value = "titulo") String titulo,
            @RequestParam(value = "ISBN") String iSBN, @RequestParam(value = "autor") String autor,
            @RequestParam(value = "resena") String reseña, @RequestParam(value = "valor") String valor,
            @RequestParam(value = "unidades") Integer unidades) {

        service.Insert(iSBN, titulo, autor, reseña, valor, unidades);
        return new ResponseEntity<String>("insert OK", HttpStatus.OK);
    }

    @DeleteMapping("/deletelibro")
    public ResponseEntity<?> PostLibrary(@RequestParam(value = "ISBN") String iSBN) {
        service.Delete(iSBN);
        return new ResponseEntity<String>("delete OK", HttpStatus.OK);
    }

}
