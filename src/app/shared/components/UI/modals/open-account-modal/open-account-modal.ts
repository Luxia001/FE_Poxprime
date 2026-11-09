import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { finalize, startWith } from 'rxjs';
import { AccountKind, CreateWalletRequest, WalletType } from '../../../../models/wallet.model';
import { WalletTypeApi } from '../../../../services/wallet/wallet.service';
import { getErrorMessage } from '../../../../../core/utils/error-message';
import { MoneyPipe } from '../../../../pipes/walet.pipe';

@Component({
  selector: 'app-open-account-modal',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, MoneyPipe],
  templateUrl: './open-account-modal.html',
})
export class OpenAccountModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(WalletTypeApi);

  readonly open = input(false);
  readonly accountTypes = input<WalletType[]>([]); // ส่งทั้ง live + demo ที่ active
  readonly initialKind = input<AccountKind>('live'); // ปุ่ม "Open demo account" ส่ง 'demo'
  readonly closed = output<void>();
  readonly created = output<void>();

  readonly submitting = signal(false);
  readonly error = signal('');
  readonly kind = signal<AccountKind>('live');
  readonly passwordMode = signal<'random' | 'custom'>('random');

  readonly demoBalances = [100, 1000, 10000, 100000];
  readonly form = this.fb.group({
    wallet_account_name: ['', Validators.maxLength(100)],
    wallet_account_type: [0, [Validators.min(1)]],
    wallet_leverage: [0, [Validators.min(1)]],
    wallet_balance: [100, [Validators.required, Validators.min(0)]],
    wallet_master_password: [''],
  });

  readonly typesOfKind = computed(() =>
    this.accountTypes().filter((t) => t.account_type === this.kind()),
  );

  private readonly selectedTypeId = toSignal(
    this.form.controls.wallet_account_type.valueChanges.pipe(
      startWith(this.form.controls.wallet_account_type.value),
    ),
    { requireSync: true },
  );

  readonly selectedType = computed(
    () => this.typesOfKind().find((t) => t.id === this.selectedTypeId()) ?? null,
  );
  readonly leverages = computed(() => this.selectedType()?.account_leverage ?? []);

  constructor() {
    // เปิด modal -> ตั้งชนิดเริ่มต้นและรีเซ็ตฟอร์ม
    effect(() => {
      if (!this.open()) return;
      const initialKind = this.initialKind();
      const types = this.accountTypes();

      untracked(() => {
        this.error.set('');
        this.kind.set(initialKind);
        this.setPasswordMode('random');
        this.form.reset({
          wallet_account_name: '',
          wallet_balance: 100,
          wallet_master_password: '',
        });
        const first = types.find((type) => type.account_type === initialKind);
        this.form.patchValue({
          wallet_account_type: first?.id ?? 0,
          wallet_leverage: first?.account_leverage[0] ?? 0,
        });
      });
    });

    // เปลี่ยนประเภทบัญชี -> ตั้ง leverage แรกที่ประเภทนั้นรองรับ
    this.form.controls.wallet_account_type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        queueMicrotask(() => this.form.controls.wallet_leverage.setValue(this.leverages()[0] ?? 0)),
      );
  }

  setKind(kind: AccountKind): void {
    this.kind.set(kind);
    if (kind === 'demo') this.setPasswordMode('random');
    this.pickFirstType();
  }

  setPasswordMode(mode: 'random' | 'custom'): void {
    this.passwordMode.set(mode);
    const password = this.form.controls.wallet_master_password;
    if (mode === 'custom') {
      password.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      password.clearValidators();
      password.setValue('');
    }
    password.updateValueAndValidity();
  }

  private pickFirstType(): void {
    const first = this.typesOfKind()[0];
    this.form.patchValue({
      wallet_account_type: first?.id ?? 0,
      wallet_leverage: first?.account_leverage[0] ?? 0,
    });
  }

  close(): void {
    if (!this.submitting()) this.closed.emit();
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    const type = this.selectedType();
    const v = this.form.getRawValue();
    if (!type || !type.account_leverage.includes(v.wallet_leverage)) return;

    const name = v.wallet_account_name.trim();
    const common = {
      wallet_type: type.account_type,
      wallet_account_name: name,
      wallet_account_type: type.id,
      wallet_leverage: v.wallet_leverage,
    };
    const payload: CreateWalletRequest =
      type.account_type === 'demo'
        ? {
            ...common,
            wallet_trading_type: 'demo',
            wallet_balance: v.wallet_balance,
            isDeposit: 0,
            isWithdraw: 1,
            isTranIn: 0,
            isTranOut: 1,
            wallet_symbol_us: 'GP',
            wallet_symbol_th: 'GP',
          }
        : {
            ...common,
            wallet_trading_type: 'live',
            ...(this.passwordMode() === 'custom'
              ? { wallet_master_password: v.wallet_master_password }
              : {}),
          };

    this.submitting.set(true);
    this.error.set('');
    this.api
      .createWallet(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.created.emit(),
        error: (err) => this.error.set(getErrorMessage(err, 'Unable to open account.')),
      });
  }
}
