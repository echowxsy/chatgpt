package config

import viper2 "github.com/spf13/viper"

func Get(key string) string {
	viper := viper2.New()
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	if err := viper.ReadInConfig(); err != nil {
		return ""
	}
	res := viper.Get(key)
	if res != nil {
		return res.(string)
	} else {
		return ""
	}
}
