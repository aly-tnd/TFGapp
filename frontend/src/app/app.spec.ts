import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component'; // <--- 1. Importa el nombre real de la clase
import { GestionUsuariosModule } from './ApiGestionFront/gestion.usuarios.module'; // Importante para que reconozca <app-crear-usuario>
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        GestionUsuariosModule // Importamos el módulo hijo para que no falle la etiqueta del formulario
      ],
      declarations: [
        AppComponent // <--- 2. Va en 'declarations', no en 'imports'
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // <--- 3. Usamos AppComponent
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Sistema de Gestión de Laboratorio'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // Verificamos que el título coincida con el que pusimos en app.component.ts
    expect(app.title).toEqual('Sistema de Gestión de Laboratorio');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Buscamos el h1. Ajusta el texto esperado si cambiaste el título
    expect(compiled.querySelector('h1')?.textContent).toContain('Sistema de Gestión de Laboratorio');
  });
});