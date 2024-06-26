package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/rs/zerolog"
	zlog "github.com/rs/zerolog/log"
)

const (
	port = ":443"
)

var (
	allowOriginMiddleware = cors.New(cors.Config{
		AllowOrigins: "*",
	})
	limiterMiddleware = limiter.New(limiter.Config{
		Max:        50,
		Expiration: 30 * time.Second,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.Get("x-forwarded-for")
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).SendString("too many request.")
		},
	})
	loggerMiddleware = func(process string) fiber.Handler {
		return logger.New(logger.Config{
			Format:     fmt.Sprintf("[%s] ${ip}:${port} ${time} ${status} - ${method} ${path} - ${latency}\n", process),
			TimeFormat: "2006-01-02T15:04:05",
		})
	}

	redirectMiddleware = func(c *fiber.Ctx) error {
		zlog.Info().Msgf(`[%s]:%s Redirected from "%s://%s%s" to https`, c.IP(), c.Port(), c.Protocol(), c.Hostname(), c.OriginalURL())
		return c.Redirect("https://"+c.Hostname()+c.OriginalURL(), fiber.StatusMovedPermanently)
	}
)

func init() {
	zlog.Logger = zlog.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

func main() {
	adminApp := fiber.New()
	adminApp.Use(allowOriginMiddleware, limiterMiddleware, loggerMiddleware("Admin"))
	adminApp.Static("/", "./admin")
	adminApp.Static("/dashboard", "./admin")
	adminApp.Static("/dashboard-scores/*", "./admin")
	adminApp.Static("/dashboard-usdp/*", "./admin")
	adminApp.Static("/profile", "./admin")
	adminApp.Static("/login", "./admin")
	adminApp.Static("/logout", "./admin")
	go func() {
		log.Println(adminApp.Listen(":3000"))
	}()

	noTLSApp := fiber.New()
	noTLSApp.Use(redirectMiddleware)
	go func() {
		log.Fatalln(noTLSApp.Listen(":80"))
	}()
	app := fiber.New()

	app.Use(allowOriginMiddleware, limiterMiddleware, loggerMiddleware("HTTPS"))

	app.Static("/", "./build")
	app.Static("/invest/*", "./build")
	app.Static("/rank", "./build")
	app.Static("/mypage/*", "./build")
	app.Static("/auth", "./build")
	app.Static("/login/*", "./build")
	app.Static("/welcome", "./build")
	app.Static("/terms", "./build")
	log.Fatalln(app.ListenTLS(port, "./server.crt", "./server.key"))
	// log.Fatalln(app.Listen(port))

}
