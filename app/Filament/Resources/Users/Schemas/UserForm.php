<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Profile Information')
                    ->schema([
                        TextInput::make('name')->required(),
                        TextInput::make('username')->required()->unique(ignoreRecord: true),
                        TextInput::make('referral_code')->required()->disabled(),
                    ])->columns(3),

                Section::make('Web3 & Financials')
                    ->schema([
                        TextInput::make('wallet_address')
                            ->label('MetaMask Wallet')
                            ->disabled()
                            ->copyable(),
                        TextInput::make('wallet.balance')
                            ->label('Wallet Balance')
                            ->numeric()
                            ->prefix('$')
                            ->disabled(),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                                'suspended' => 'Suspended',
                            ])
                            ->default('active')
                            ->required(),
                    ])->columns(3),
            ]);
    }
}
